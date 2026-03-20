using AngleSharp;
using Asp.Versioning;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Routing;
using Umbraco.Community.SchemaPreview.Models;
using Umbraco.Community.SchemaPreview.Services;

namespace Umbraco.Community.SchemaPreview.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Umbraco.Community.SchemaPreview")]
    public class UmbracoCommunitySchemaPreviewApiController : UmbracoCommunitySchemaPreviewApiControllerBase
    {
        private readonly ICacheManager _cacheManager;
        private readonly IPublishedUrlProvider _urlProvider;
        private readonly IHttpClientFactory _http;
        private readonly IWebHostEnvironment _env;
        private readonly USchemaOptions _options;
        private readonly ValidationHistoryService _history;

        public UmbracoCommunitySchemaPreviewApiController(
            ICacheManager cacheManager,
            IPublishedUrlProvider urlProvider,
            IHttpClientFactory http,
            IWebHostEnvironment env,
            IOptions<USchemaOptions> options,
            ValidationHistoryService history)
        {
            _cacheManager = cacheManager;
            _urlProvider = urlProvider;
            _http = http;
            _env = env;
            _options = options.Value;
            _history = history;
        }

        [HttpGet("ping")]
        [ProducesResponseType<object>(StatusCodes.Status200OK)]
        public IActionResult Ping() => Ok(new { ok = true, from = "SchemaPreview" });

        [HttpGet("validate/key/{key:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ValidateByKey(Guid key)
        {
            var content = await _cacheManager.Content.GetByIdAsync(key, preview: false);
            return await ValidateInternal(content,
                content == null ? $"Key {key} was not found in the published cache — ensure the page is published." : null);
        }

        [HttpGet("validate/id/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ValidateById(int id)
        {
            var content = await _cacheManager.Content.GetByIdAsync(id, preview: false);
            return await ValidateInternal(content,
                content == null ? $"Id {id} was not found in the published cache — ensure the page is published." : null);
        }

        [HttpGet("validate/udi/{udi}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ValidateByUdi(string udi)
        {
            if (!UdiParser.TryParse(udi, out var parsed) || parsed is not GuidUdi guidUdi)
                return BadRequest(new { error = "Invalid UDI" });

            var content = await _cacheManager.Content.GetByIdAsync(guidUdi.Guid, preview: false);
            return await ValidateInternal(content,
                content == null ? $"UDI {udi} was not found in the published cache — ensure the page is published." : null);
        }

        private async Task<IActionResult> ValidateInternal(IPublishedContent? content, string? diagnostic = null)
        {
            if (content == null)
            {
                return Ok(new
                {
                    published = false,
                    url = (string?)null,
                    blocks = Array.Empty<object>(),
                    fetchError = diagnostic ?? "Content not found in the published cache.",
                    suggestedSchemaType = (string?)null,
                    summary = new { valid = 0, invalid = 0, warnings = 0, none = true }
                });
            }

            var currentUri = _env.IsDevelopment()
                ? new Uri($"{Request.Scheme}://{Request.Host}")
                : null;
            var url = _urlProvider.GetUrl(content, UrlMode.Absolute, current: currentUri);
            if (string.IsNullOrWhiteSpace(url) || url == "#")
            {
                return Ok(new
                {
                    published = false,
                    url = (string?)null,
                    blocks = Array.Empty<object>(),
                    suggestedSchemaType = (string?)null,
                    summary = new { valid = 0, invalid = 0, warnings = 0, none = true }
                });
            }

            // In development, rewrite the URL host to match the current request.
            if (_env.IsDevelopment() && Uri.TryCreate(url, UriKind.Absolute, out var resolvedUri))
            {
                var builder = new UriBuilder(resolvedUri)
                {
                    Scheme = Request.Scheme,
                    Host = Request.Host.Host,
                    Port = Request.Host.Port ?? -1
                };
                url = builder.Uri.ToString();
            }

            string html;
            try
            {
                html = await _http.CreateClient(Constants.HttpClientName).GetStringAsync(url);
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    url,
                    published = true,
                    fetchError = ex.Message,
                    blocks = Array.Empty<object>(),
                    suggestedSchemaType = (string?)null,
                    summary = new { valid = 0, invalid = 0, warnings = 0, none = true }
                });
            }

            var browsingContext = BrowsingContext.New(Configuration.Default);
            var doc = await browsingContext.OpenAsync(req => req.Content(html));
            var scripts = doc.QuerySelectorAll("script[type='application/ld+json']");

            var documentType = content.ContentType.Alias;
            var hasTemplate = content.TemplateId > 0;

            var blocks = new List<object>();
            int valid = 0, invalid = 0, warn = 0;

            for (var i = 0; i < scripts.Length; i++)
            {
                var raw = scripts[i].TextContent;
                var result = ValidateJsonLd(raw);
                var location = scripts[i].Closest("head") != null ? "head" : "body";

                if (result.Errors.Count > 0) invalid++;
                else if (result.Warnings.Count > 0) warn++;
                else valid++;

                blocks.Add(new
                {
                    index = i + 1,
                    type = result.Type,
                    raw,
                    errors = result.Errors,
                    warnings = result.Warnings,
                    location,
                    richResultStatus = result.RichResultStatus,
                    richResultMissingFields = result.RichResultMissingFields
                });
            }

            // Suggest a schema type if no blocks found and the document type is mapped
            string? suggestedSchemaType = null;
            if (scripts.Length == 0 && documentType != null)
                _options.DocumentTypeSchemaMap.TryGetValue(documentType, out suggestedSchemaType);

            var resultPayload = new
            {
                url,
                published = true,
                documentType,
                hasTemplate,
                suggestedSchemaType,
                blocks,
                summary = new { valid, invalid, warnings = warn, none = scripts.Length == 0 }
            };

            _history.Record(content.Key, resultPayload, valid, warn, invalid);

            return Ok(resultPayload);
        }

        [HttpGet("validate/history/{key:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetHistory(Guid key)
        {
            var entries = _history.GetHistory(key);
            var summaries = entries.Select((e, i) => new ValidationHistorySummary
            {
                Index         = i,
                ScannedAt     = e.ScannedAt,
                ValidBlocks   = e.ValidBlocks,
                WarningBlocks = e.WarningBlocks,
                InvalidBlocks = e.InvalidBlocks,
                TotalBlocks   = e.TotalBlocks,
                HasResult     = e.Result != null
            });
            return Ok(summaries);
        }

        [HttpGet("validate/history/{key:guid}/{index:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetHistoryEntry(Guid key, int index)
        {
            var entry = _history.GetEntry(key, index);
            if (entry == null) return NotFound();
            return Ok(entry.Result);
        }

        [HttpDelete("validate/history/{key:guid}/{index:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteHistoryEntry(Guid key, int index)
        {
            return _history.DeleteEntry(key, index) ? NoContent() : NotFound();
        }

        [HttpDelete("validate/history/{key:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult ClearHistory(Guid key)
        {
            _history.ClearHistory(key);
            return NoContent();
        }

        private static ValidationData ValidateJsonLd(string raw)
        {
            var errors = new List<string>();
            var warnings = new List<string>();

            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(raw);
                var root = doc.RootElement;

                // For @graph blocks, validate the first graph node's properties
                var target = root;
                if (!root.TryGetProperty("@type", out _) &&
                    root.TryGetProperty("@graph", out var g) &&
                    g.ValueKind == System.Text.Json.JsonValueKind.Array &&
                    g.GetArrayLength() > 0)
                {
                    target = g[0];
                }

                var type = target.TryGetProperty("@type", out var t) ? t.ToString() : "Unknown";

                if (!root.TryGetProperty("@context", out _)) errors.Add("Missing @context");
                if (string.IsNullOrWhiteSpace(type) || type == "Unknown") errors.Add("Missing @type");

                void MustHave(params string[] props)
                {
                    foreach (var p in props)
                        if (!target.TryGetProperty(p, out _)) warnings.Add($"Recommended: {p}");
                }

                switch (type)
                {
                    case "Article":
                    case "NewsArticle":
                    case "BlogPosting": MustHave("headline", "datePublished", "author", "image"); break;
                    case "WebPage": MustHave("name", "url"); break;
                    case "WebSite": MustHave("name", "url"); break;
                    case "Organization":
                    case "Corporation":
                    case "NGO": MustHave("name", "url", "logo"); break;
                    case "LocalBusiness":
                    case "Restaurant":
                    case "Store":
                    case "Hotel": MustHave("name", "address", "telephone"); break;
                    case "Person": MustHave("name"); break;
                    case "BreadcrumbList": MustHave("itemListElement"); break;
                    case "FAQPage": MustHave("mainEntity"); break;
                    case "Product": MustHave("name", "description", "offers"); break;
                    case "Event":
                    case "SportsEvent":
                    case "MusicEvent": MustHave("name", "startDate", "location"); break;
                    case "Recipe": MustHave("name", "recipeIngredient", "recipeInstructions"); break;
                    case "VideoObject": MustHave("name", "description", "thumbnailUrl", "uploadDate"); break;
                    case "HowTo": MustHave("name", "step"); break;
                    case "JobPosting": MustHave("title", "hiringOrganization", "jobLocation", "datePosted"); break;
                    case "Review":
                    case "AggregateRating": MustHave("itemReviewed", "ratingValue"); break;
                    case "Book": MustHave("name", "author", "isbn"); break;
                    case "Course":
                    case "EducationalOccupationalProgram": MustHave("name", "description", "provider"); break;
                    case "Dataset": MustHave("name", "description"); break;
                    case "Movie": MustHave("name", "director"); break;
                    case "SoftwareApplication": MustHave("name", "operatingSystem", "applicationCategory"); break;
                    case "QAPage": MustHave("mainEntity"); break;
                    case "ItemList": MustHave("itemListElement"); break;
                    case "ClaimReview": MustHave("claimReviewed", "reviewRating", "url"); break;
                }

                var (richStatus, richMissing) = CheckRichResults(type, target);
                return new ValidationData(type, errors, warnings, richStatus, richMissing);
            }
            catch (Exception ex)
            {
                errors.Add($"JSON parse error: {ex.Message}");
                return new ValidationData("Invalid JSON", errors, warnings, "unknown", new List<string>());
            }
        }

        /// <summary>
        /// Checks whether a schema block meets Google's specific requirements for Rich Results.
        /// Returns "eligible", "ineligible", or "unknown" (type not tracked).
        /// </summary>
        private static (string status, List<string> missing) CheckRichResults(
            string type, System.Text.Json.JsonElement target)
        {
            var missing = new List<string>();
            bool Has(string prop) => target.TryGetProperty(prop, out _);

            switch (type)
            {
                case "Article":
                case "NewsArticle":
                case "BlogPosting":
                    if (!Has("headline")) missing.Add("headline");
                    if (!Has("author")) missing.Add("author");
                    if (!Has("datePublished")) missing.Add("datePublished");
                    if (!Has("image")) missing.Add("image");
                    break;

                case "BreadcrumbList":
                    if (!Has("itemListElement")) missing.Add("itemListElement");
                    break;

                case "FAQPage":
                    if (!Has("mainEntity")) missing.Add("mainEntity");
                    break;

                case "HowTo":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("step")) missing.Add("step");
                    break;

                case "JobPosting":
                    if (!Has("title")) missing.Add("title");
                    if (!Has("description")) missing.Add("description");
                    if (!Has("datePosted")) missing.Add("datePosted");
                    if (!Has("hiringOrganization")) missing.Add("hiringOrganization");
                    if (!Has("jobLocation")) missing.Add("jobLocation");
                    break;

                case "LocalBusiness":
                case "Restaurant":
                case "Store":
                case "Hotel":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("address")) missing.Add("address");
                    break;

                case "Product":
                    if (!Has("name")) missing.Add("name");
                    // Google requires at least one of: offers, aggregateRating, or review
                    if (!Has("offers") && !Has("aggregateRating") && !Has("review"))
                        missing.Add("offers (or aggregateRating / review)");
                    break;

                case "Recipe":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("image")) missing.Add("image");
                    if (!Has("recipeIngredient")) missing.Add("recipeIngredient");
                    if (!Has("recipeInstructions")) missing.Add("recipeInstructions");
                    break;

                case "Review":
                case "AggregateRating":
                    if (!Has("itemReviewed")) missing.Add("itemReviewed");
                    if (!Has("ratingValue")) missing.Add("ratingValue");
                    break;

                case "VideoObject":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("description")) missing.Add("description");
                    if (!Has("thumbnailUrl")) missing.Add("thumbnailUrl");
                    if (!Has("uploadDate")) missing.Add("uploadDate");
                    break;

                case "Event":
                case "SportsEvent":
                case "MusicEvent":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("startDate")) missing.Add("startDate");
                    if (!Has("location")) missing.Add("location");
                    break;

                case "Course":
                case "EducationalOccupationalProgram":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("description")) missing.Add("description");
                    if (!Has("provider")) missing.Add("provider");
                    break;

                case "Movie":
                    if (!Has("name")) missing.Add("name");
                    break;

                case "Dataset":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("description")) missing.Add("description");
                    break;

                case "SoftwareApplication":
                    if (!Has("name")) missing.Add("name");
                    if (!Has("operatingSystem")) missing.Add("operatingSystem");
                    if (!Has("applicationCategory")) missing.Add("applicationCategory");
                    break;

                default:
                    return ("unknown", missing);
            }

            return (missing.Count == 0 ? "eligible" : "ineligible", missing);
        }

        private record ValidationData(
            string Type,
            List<string> Errors,
            List<string> Warnings,
            string RichResultStatus,
            List<string> RichResultMissingFields);
    }
}
