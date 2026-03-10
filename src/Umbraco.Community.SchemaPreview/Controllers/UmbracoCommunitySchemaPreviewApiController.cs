using AngleSharp;
using Asp.Versioning;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Routing;

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

        public UmbracoCommunitySchemaPreviewApiController(
            ICacheManager cacheManager,
            IPublishedUrlProvider urlProvider,
            IHttpClientFactory http,
            IWebHostEnvironment env)
        {
            _cacheManager = cacheManager;
            _urlProvider = urlProvider;
            _http = http;
            _env = env;
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
                    summary = new { valid = 0, invalid = 0, warnings = 0, none = true }
                });
            }

            // In development, rewrite the URL host to match the current request.
            // This ensures self-calls work even when a different hostname is configured in Umbraco
            // (e.g. a production domain stored in Culture & Hostnames on a local test site).
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
                var (type, errors, warnings) = ValidateJsonLd(raw);
                var location = scripts[i].Closest("head") != null ? "head" : "body";
                if (errors.Count > 0) invalid++;
                else if (warnings.Count > 0) warn++;
                else valid++;

                blocks.Add(new { index = i + 1, type, raw, errors, warnings, location });
            }

            return Ok(new
            {
                url,
                published = true,
                documentType,
                hasTemplate,
                blocks,
                summary = new { valid, invalid, warnings = warn, none = scripts.Length == 0 }
            });
        }

        private static (string type, List<string> errors, List<string> warnings) ValidateJsonLd(string raw)
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

                return (type, errors, warnings);
            }
            catch (Exception ex)
            {
                errors.Add($"JSON parse error: {ex.Message}");
                return ("Invalid JSON", errors, warnings);
            }
        }
    }
}
