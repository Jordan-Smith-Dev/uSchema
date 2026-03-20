import { LitElement as x, html as a, css as y, state as u, customElement as _ } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as w } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as k } from "@umbraco-cms/backoffice/document";
import { UMB_AUTH_CONTEXT as $ } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as z } from "@umbraco-cms/backoffice/notification";
var S = Object.defineProperty, j = Object.getOwnPropertyDescriptor, d = (e, t, o, r) => {
  for (var s = r > 1 ? void 0 : r ? j(t, o) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (s = (r ? n(t, o, s) : n(s)) || s);
  return r && s && S(t, o, s), s;
};
function E(e) {
  return e === "Missing @context" ? {
    title: a`
                Missing
                <code class="prop-name">@context</code>
            `,
    detail: "Every JSON-LD block must declare a context so search engines know how to interpret the properties.",
    example: '"@context": "https://schema.org"',
    docsUrl: "https://schema.org/docs/gs1.html"
  } : e === "Missing @type" ? {
    title: a`
                Missing
                <code class="prop-name">@type</code>
            `,
    detail: a`
                The
                <code class="prop-name">@type</code>
                property tells search engines what kind of entity this block
                represents (e.g.
                <code class="prop-name">WebPage</code>
                ,
                <code class="prop-name">Article</code>
                ,
                <code class="prop-name">Organization</code>
                ).
            `,
    example: '"@type": "WebPage"',
    docsUrl: "https://schema.org/docs/gs1.html"
  } : e.startsWith("JSON parse error:") ? {
    title: "Invalid JSON — block cannot be parsed",
    detail: `This block contains malformed JSON. Fix the syntax error and re-validate. Parser said: ${e.replace("JSON parse error: ", "")}`,
    docsUrl: "https://jsonlint.com"
  } : {
    "Recommended: headline": {
      title: "is recommended",
      propertyName: "headline",
      detail: "A concise title for the article (max 110 characters). Required by Google to be eligible for Article rich results in Search.",
      example: '"headline": "5 Ways to Improve Your SEO in 2024"',
      docsUrl: "https://developers.google.com/search/docs/appearance/structured-data/article"
    },
    "Recommended: datePublished": {
      title: "is recommended",
      propertyName: "datePublished",
      detail: "The date the content was first published, in ISO 8601 format. Helps search engines surface timely and recently updated content.",
      example: '"datePublished": "2024-01-15T09:00:00+00:00"',
      docsUrl: "https://schema.org/datePublished"
    },
    "Recommended: author": {
      title: "is recommended",
      propertyName: "author",
      detail: "Identifies who created the content. Strengthens E-E-A-T (Experience, Expertise, Authority, Trust) signals that Google uses when ranking content.",
      example: '"author": { "@type": "Person", "name": "Jane Doe", "url": "https://example.com/team/jane" }',
      docsUrl: "https://schema.org/author"
    },
    "Recommended: image": {
      title: "is recommended",
      propertyName: "image",
      detail: "A representative image for the article. Google requires at least one image to show Article rich results — without it the block may be ignored.",
      example: '"image": "https://example.com/images/article-cover.jpg"',
      docsUrl: "https://developers.google.com/search/docs/appearance/structured-data/article#article-properties"
    },
    "Recommended: name": {
      title: "is recommended",
      propertyName: "name",
      detail: "The name or title of this entity. Required for most rich result types and used by search engines to label the entity in knowledge panels.",
      example: '"name": "Acme Corporation"',
      docsUrl: "https://schema.org/name"
    },
    "Recommended: url": {
      title: "is recommended",
      propertyName: "url",
      detail: "The canonical URL of this entity or page. Helps search engines identify the definitive location and avoid treating it as a duplicate.",
      example: '"url": "https://www.example.com"',
      docsUrl: "https://schema.org/url"
    },
    "Recommended: logo": {
      title: "is recommended",
      propertyName: "logo",
      detail: "The organisation's logo image. Used by Google for Knowledge Panels, Sitelinks, and other rich results. Prefer a wide, rectangular image.",
      example: '"logo": { "@type": "ImageObject", "url": "https://example.com/logo.png", "width": 200, "height": 60 }',
      docsUrl: "https://developers.google.com/search/docs/appearance/structured-data/organization#logo"
    },
    "Recommended: itemListElement": {
      title: a`
                is required for
                <code class="prop-name">BreadcrumbList</code>
            `,
      propertyName: "itemListElement",
      detail: a`
                An ordered array of
                <code class="prop-name">ListItem</code>
                entries that make up the breadcrumb trail. Without this the
                <code class="prop-name">BreadcrumbList</code>
                block is empty and search engines will ignore it.
            `,
      example: '"itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" }]',
      docsUrl: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb"
    },
    "Recommended: mainEntity": {
      title: a`
                is required for
                <code class="prop-name">FAQPage</code>
            `,
      propertyName: "mainEntity",
      detail: a`
                An array of
                <code class="prop-name">Question</code>
                entities. Without this an
                <code class="prop-name">FAQPage</code>
                block has no questions to display and will not generate FAQ rich
                results in Search.
            `,
      example: '"mainEntity": [{ "@type": "Question", "name": "What is schema.org?", "acceptedAnswer": { "@type": "Answer", "text": "A vocabulary for structured data on the web." } }]',
      docsUrl: "https://developers.google.com/search/docs/appearance/structured-data/faqpage"
    }
  }[e] ?? { title: e, detail: "" };
}
const g = "/umbraco/umbracocommunityschemapreview/api/v1", P = {
  Article: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your article headline",
  "datePublished": "2024-01-15",
  "author": { "@type": "Person", "name": "Author Name" },
  "image": "https://example.com/article-image.jpg"
}`,
  BlogPosting: `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Your blog post title",
  "datePublished": "2024-01-15",
  "author": { "@type": "Person", "name": "Author Name" },
  "image": "https://example.com/blog-image.jpg"
}`,
  Product: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "A short description of the product.",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock"
  }
}`,
  WebPage: `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "url": "https://example.com/page"
}`,
  Event: `{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Event Name",
  "startDate": "2025-06-15T10:00:00",
  "location": {
    "@type": "Place",
    "name": "Venue Name",
    "address": "123 Example Street, London"
  }
}`,
  LocalBusiness: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Example Street",
    "addressLocality": "London"
  },
  "telephone": "+44 20 1234 5678"
}`,
  Organization: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Organisation Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}`,
  Person: `{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Full Name",
  "url": "https://example.com/author/full-name"
}`,
  Author: `{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Full Name",
  "url": "https://example.com/author/full-name"
}`,
  FAQPage: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your answer here."
      }
    }
  ]
}`,
  Recipe: `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Recipe Name",
  "recipeIngredient": ["1 cup flour", "2 eggs"],
  "recipeInstructions": "Step-by-step instructions here."
}`,
  JobPosting: `{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Job Title",
  "description": "Role description.",
  "datePosted": "2024-01-15",
  "hiringOrganization": { "@type": "Organization", "name": "Company Name" },
  "jobLocation": {
    "@type": "Place",
    "address": { "@type": "PostalAddress", "addressLocality": "London" }
  }
}`,
  VideoObject: `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video Title",
  "description": "A short description of the video.",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "uploadDate": "2024-01-15"
}`
}, f = a`
    <svg
        class="btn-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.75"
        viewBox="0 0 24 24"
    >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
        <path d="M21 3v5h-5"></path>
    </svg>
`, p = a`
    <svg
        class="btn-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.75"
        viewBox="0 0 24 24"
    >
        <path
            d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
        ></path>
    </svg>
`, m = (e) => a`
    <svg
        class="btn-icon${e ? " btn-icon--up" : ""}"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="m4 9 8 8 8-8"></path>
    </svg>
`, A = a`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
        stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
`, C = a`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
        stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
`, B = a`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
        stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
`, R = a`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
        stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
`, T = {
  Article: "https://developers.google.com/search/docs/appearance/structured-data/article",
  NewsArticle: "https://developers.google.com/search/docs/appearance/structured-data/article",
  BlogPosting: "https://developers.google.com/search/docs/appearance/structured-data/article",
  BreadcrumbList: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
  FAQPage: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
  HowTo: "https://developers.google.com/search/docs/appearance/structured-data/how-to",
  JobPosting: "https://developers.google.com/search/docs/appearance/structured-data/job-posting",
  LocalBusiness: "https://developers.google.com/search/docs/appearance/structured-data/local-business",
  Restaurant: "https://developers.google.com/search/docs/appearance/structured-data/local-business",
  Store: "https://developers.google.com/search/docs/appearance/structured-data/local-business",
  Hotel: "https://developers.google.com/search/docs/appearance/structured-data/local-business",
  Product: "https://developers.google.com/search/docs/appearance/structured-data/product",
  Recipe: "https://developers.google.com/search/docs/appearance/structured-data/recipe",
  Review: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
  AggregateRating: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
  VideoObject: "https://developers.google.com/search/docs/appearance/structured-data/video",
  Event: "https://developers.google.com/search/docs/appearance/structured-data/event",
  SportsEvent: "https://developers.google.com/search/docs/appearance/structured-data/event",
  MusicEvent: "https://developers.google.com/search/docs/appearance/structured-data/event",
  Course: "https://developers.google.com/search/docs/appearance/structured-data/course",
  Movie: "https://developers.google.com/search/docs/appearance/structured-data/movie",
  Dataset: "https://developers.google.com/search/docs/appearance/structured-data/dataset",
  SoftwareApplication: "https://developers.google.com/search/docs/appearance/structured-data/software-app"
};
let l = class extends w(x) {
  constructor() {
    super(...arguments), this._loading = !0, this._result = null, this._error = null, this._activeFilter = null, this._collapsedBlocks = /* @__PURE__ */ new Set(), this._history = [], this._historyExpanded = !1, this._historyLoading = null, this._historicalIndex = null, this._unique = null;
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext($, (e) => {
      this._tokenProvider = e == null ? void 0 : e.getOpenApiConfiguration().token;
    }), this.consumeContext(z, (e) => {
      this._notificationContext = e;
    }), this.consumeContext(k, async (e) => {
      var o;
      const t = (o = e == null ? void 0 : e.getUnique) == null ? void 0 : o.call(e);
      if (!t) {
        this._error = "Could not determine content key from workspace.", this._loading = !1;
        return;
      }
      this._unique = t, await this._validate(t), this._fetchHistory(t);
    });
  }
  async _validate(e) {
    this._loading = !0, this._error = null, this._result = null, this._activeFilter = null, this._collapsedBlocks = /* @__PURE__ */ new Set(), this._historicalIndex = null;
    try {
      const t = this._tokenProvider ? await this._tokenProvider() : void 0, o = await fetch(`${g}/validate/key/${e}`, {
        headers: {
          Accept: "application/json",
          ...t ? { Authorization: `Bearer ${t}` } : {}
        }
      });
      if (!o.ok)
        throw new Error(
          `Validation request failed: ${o.status} ${o.statusText}`
        );
      this._result = await o.json(), this._result && this._notifyResult(this._result), this._fetchHistory(e);
    } catch (t) {
      this._error = t instanceof Error ? t.message : "An unexpected error occurred.";
    } finally {
      this._loading = !1;
    }
  }
  async _fetchHistory(e) {
    try {
      const t = this._tokenProvider ? await this._tokenProvider() : void 0, o = await fetch(`${g}/validate/history/${e}`, {
        headers: {
          Accept: "application/json",
          ...t ? { Authorization: `Bearer ${t}` } : {}
        }
      });
      o.ok && (this._history = await o.json());
    } catch {
    }
  }
  async _loadHistoryEntry(e, t) {
    this._historyLoading = t;
    try {
      const o = this._tokenProvider ? await this._tokenProvider() : void 0, r = await fetch(`${g}/validate/history/${e}/${t}`, {
        headers: {
          Accept: "application/json",
          ...o ? { Authorization: `Bearer ${o}` } : {}
        }
      });
      r.ok && (this._result = await r.json(), this._historicalIndex = t, this._activeFilter = null, this._collapsedBlocks = /* @__PURE__ */ new Set());
    } catch {
    } finally {
      this._historyLoading = null;
    }
  }
  async _deleteHistoryEntry(e, t) {
    try {
      const o = this._tokenProvider ? await this._tokenProvider() : void 0;
      await fetch(`${g}/validate/history/${e}/${t}`, {
        method: "DELETE",
        headers: o ? { Authorization: `Bearer ${o}` } : {}
      }), this._historicalIndex === t && (this._historicalIndex = null, this._result = null), this._fetchHistory(e);
    } catch {
    }
  }
  async _clearHistory(e) {
    try {
      const t = this._tokenProvider ? await this._tokenProvider() : void 0;
      await fetch(`${g}/validate/history/${e}`, {
        method: "DELETE",
        headers: t ? { Authorization: `Bearer ${t}` } : {}
      }), this._history = [], this._historicalIndex = null;
    } catch {
    }
  }
  _notifyResult(e) {
    if (!this._notificationContext || e.fetchError || !e.published)
      return;
    const t = e.summary;
    t.none || (t.invalid > 0 ? this._notificationContext.peek("danger", {
      data: {
        headline: "Schema errors detected",
        message: `${t.invalid} block${t.invalid !== 1 ? "s have" : " has"} errors that will prevent rich results.`
      }
    }) : t.warnings > 0 ? this._notificationContext.peek("warning", {
      data: {
        headline: "Schema recommendations",
        message: `${t.warnings} block${t.warnings !== 1 ? "s have" : " has"} missing properties that could improve rich result eligibility.`
      }
    }) : this._notificationContext.peek("positive", {
      data: {
        headline: "Schema looks good",
        message: `All ${t.valid} block${t.valid !== 1 ? "s" : ""} passed validation.`
      }
    }));
  }
  _blockStatus(e) {
    return e.errors.length > 0 ? "invalid" : e.warnings.length > 0 ? "warning" : "valid";
  }
  _toggleFilter(e) {
    this._activeFilter = this._activeFilter === e ? null : e;
  }
  _filteredBlocks() {
    return this._result ? this._activeFilter ? this._result.blocks.filter(
      (e) => this._blockStatus(e) === this._activeFilter
    ) : this._result.blocks : [];
  }
  async _revalidate() {
    !this._unique || this._loading || await this._validate(this._unique);
  }
  _toggleCollapse(e) {
    const t = new Set(this._collapsedBlocks);
    t.has(e) ? t.delete(e) : t.add(e), this._collapsedBlocks = t;
  }
  _toggleAll() {
    if (!this._result) return;
    const e = this._result.blocks.every(
      (o) => this._collapsedBlocks.has(o.index)
    ), t = new Set(this._collapsedBlocks);
    for (const o of this._result.blocks)
      e ? t.delete(o.index) : t.add(o.index);
    this._collapsedBlocks = t;
  }
  _allCollapsed() {
    return !this._result || this._result.blocks.length === 0 ? !1 : this._result.blocks.every(
      (e) => this._collapsedBlocks.has(e.index)
    );
  }
  _getDuplicateTypes() {
    if (!this._result) return [];
    const e = {};
    for (const t of this._result.blocks)
      t.type && t.type !== "Unknown" && t.type !== "Invalid JSON" && (e[t.type] = (e[t.type] ?? 0) + 1);
    return Object.entries(e).filter(([, t]) => t > 1).map(([t]) => t);
  }
  _renderSummary() {
    if (!this._result) return null;
    const e = this._result.summary, t = this._activeFilter, o = e.valid + e.warnings + e.invalid, r = (s) => t === null ? `stat-card stat-card--${s}` : t === s ? `stat-card stat-card--${s} stat-card--active` : `stat-card stat-card--${s} stat-card--dimmed`;
    return a`
            <div class="stats-row">
                <div
                    class=${r("valid")}
                    @click=${() => this._toggleFilter("valid")}
                    title="Click to filter by valid blocks"
                    role="button" tabindex="0"
                >
                    <div class="stat-card__icon">${A}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value">${e.valid}</span>
                        <span class="stat-card__label">Valid</span>
                    </div>
                </div>

                <div
                    class=${r("warning")}
                    @click=${() => this._toggleFilter("warning")}
                    title="Click to filter by warning blocks"
                    role="button" tabindex="0"
                >
                    <div class="stat-card__icon">${C}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value">${e.warnings}</span>
                        <span class="stat-card__label">Warnings</span>
                    </div>
                </div>

                <div
                    class=${r("invalid")}
                    @click=${() => this._toggleFilter("invalid")}
                    title="Click to filter by invalid blocks"
                    role="button" tabindex="0"
                >
                    <div class="stat-card__icon">${B}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value">${e.invalid}</span>
                        <span class="stat-card__label">Invalid</span>
                    </div>
                </div>

                <div class="stat-card stat-card--total">
                    <div class="stat-card__icon">${R}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value">${o}</span>
                        <span class="stat-card__label">Total Blocks</span>
                    </div>
                </div>
            </div>

            <div class="filter-row">
                <div class="filter-row__hint">
                    ${t ? a`<p class="filter-hint">Showing <strong>${t}</strong> blocks only &mdash; click the card again to clear.</p>` : null}
                </div>
                <div class="summary-actions">
                    <uui-button
                        look="primary"
                        compact
                        @click=${this._toggleAll}
                        title=${this._allCollapsed() ? "Expand all blocks" : "Collapse all blocks"}
                    >
                        <span class="btn-content">
                            ${this._allCollapsed() ? "Expand all" : "Collapse all"}
                            ${m(this._allCollapsed())}
                        </span>
                    </uui-button>
                    ${this._result.url ? a`
                              <uui-button
                                  look="primary"
                                  href=${"https://search.google.com/test/rich-results?url=" + encodeURIComponent(this._result.url)}
                                  target="_blank"
                                  label="Rich Results Test"
                                  title="Check which Google rich result features this page qualifies for (opens in a new tab)"
                              >
                                  <span class="btn-content">
                                      Rich Results Test ${p}
                                  </span>
                              </uui-button>
                              <uui-button
                                  look="primary"
                                  href=${"https://validator.schema.org/#url=" + encodeURIComponent(this._result.url)}
                                  target="_blank"
                                  label="Validate on schema.org"
                                  title="Open this page in Google's Schema Markup Validator (opens in a new tab)"
                              >
                                  <span class="btn-content">
                                      Validate on schema.org ${p}
                                  </span>
                              </uui-button>
                          ` : null}
                </div>
            </div>
        `;
  }
  _renderHistory() {
    if (!this._unique || this._history.length === 0) return null;
    const e = this._unique;
    return a`
            <div class="history-section">
                <h4 class="section-heading section-heading--history">
                    <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 8l0 4l2 2"/>
                        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
                    </svg>
                    Validation history
                    <span class="section-heading-count">
                        (<strong>${this._history.length}</strong>
                        scan${this._history.length !== 1 ? "s" : ""})
                    </span>
                    <uui-button look="outline" compact
                        @click=${() => {
      this._historyExpanded = !this._historyExpanded;
    }}>
                        <span class="btn-content">
                            ${this._historyExpanded ? "Collapse" : "Show"}
                            ${m(this._historyExpanded)}
                        </span>
                    </uui-button>
                </h4>
                ${this._historyExpanded ? a`
                    <div class="exec-card history-table-card">
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Date of scan</th>
                                    <th class="th--valid">Valid</th>
                                    <th class="th--warnings">Warnings</th>
                                    <th class="th--invalid">Invalid</th>
                                    <th class="th--total">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this._history.map((t) => {
      const o = this._result !== null && (this._historicalIndex ?? 0) === t.index;
      return a`
                                    <tr class="${o ? "history-row--active" : ""}">
                                        <td>${new Date(t.scannedAt).toLocaleString()}</td>
                                        <td><span class="count-badge count-badge--valid">${t.validBlocks}</span></td>
                                        <td><span class="count-badge count-badge--warnings">${t.warningBlocks}</span></td>
                                        <td><span class="count-badge count-badge--invalid">${t.invalidBlocks}</span></td>
                                        <td>${t.totalBlocks}</td>
                                        <td class="history-actions">
                                            ${t.hasResult ? a`
                                                <uui-button look="${o ? "primary" : "outline"}" compact
                                                    class="history-load-btn"
                                                    ?disabled=${this._historyLoading === t.index}
                                                    @click=${() => this._loadHistoryEntry(e, t.index)}>
                                                    ${this._historyLoading === t.index ? a`<uui-loader-circle></uui-loader-circle>` : o ? "Loaded" : "Load"}
                                                </uui-button>
                                            ` : null}
                                            <uui-button look="primary" compact color="danger"
                                                @click=${() => this._deleteHistoryEntry(e, t.index)}
                                                title="Delete this history entry">
                                                Delete
                                            </uui-button>
                                        </td>
                                    </tr>
                                `;
    })}
                            </tbody>
                        </table>
                        <div class="history-footer">
                            <uui-button look="primary" compact color="danger"
                                @click=${() => this._clearHistory(e)}>
                                Clear all history
                            </uui-button>
                        </div>
                    </div>
                ` : null}
            </div>
        `;
  }
  _renderMessage(e, t, o) {
    const r = E(e), s = r.propertyName ? a`
                  <code class="prop-name">"${r.propertyName}"</code>
                  ${r.title}
              ` : r.title;
    return a`
            <li class="msg-item">
                <div class="msg-header">
                    <span class="msg-index">${t}.</span>
                    <span class="msg-kind msg-kind--${o}">
                        ${o === "error" ? "Error" : "Warning"}
                    </span>
                    <strong class="msg-title">${s}</strong>
                    ${r.docsUrl ? a`
                              <uui-button
                                  look="primary"
                                  href=${r.docsUrl}
                                  class="msg-button"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  label="Learn more"
                                  title="Navigate to this page for more information about this issue (opens in a new tab)"
                                  compact
                              >
                                  <span class="btn-content">
                                      Learn more ${p}
                                  </span>
                              </uui-button>
                          ` : null}
                </div>
                ${r.detail ? a`
                          <p class="msg-detail">${r.detail}</p>
                      ` : null}
                ${r.example ? a`
                          <pre class="msg-example">${r.example}</pre>
                      ` : null}
            </li>
        `;
  }
  _exampleValue(e) {
    return {
      "@context": '"https://schema.org"',
      "@type": '"Article"',
      headline: '"Your article headline"',
      name: '"Your name or organisation name"',
      description: '"A brief description of this content"',
      url: '"https://example.com/page"',
      image: '"https://example.com/image.jpg"',
      datePublished: '"2024-01-01"',
      dateModified: '"2024-01-01"',
      author: '{ "@type": "Person", "name": "Author Name" }',
      publisher: '{ "@type": "Organization", "name": "Publisher Name" }',
      mainEntityOfPage: '"https://example.com/page"',
      articleBody: '"The full text of the article…"',
      articleSection: '"Technology"'
    }[e] ?? '"…"';
  }
  _buildAnnotations(e) {
    const t = [];
    for (const o of e.errors)
      o === "Missing @context" ? t.push({ prop: "@context", kind: "error" }) : o === "Missing @type" && t.push({ prop: "@type", kind: "error" });
    for (const o of e.warnings) {
      const r = o.match(/^Recommended: (\S+)$/);
      r && t.push({ prop: r[1], kind: "warning" });
    }
    return t;
  }
  _renderJsonBlock(e) {
    return a`
            <div class="json-viewer">
                <div class="json-viewer__header">JSON — ${e.type}</div>
                <pre class="json-viewer__pre"><code class="json-viewer__code">${e.raw}</code></pre>
            </div>
        `;
  }
  _renderExamplesBlock(e) {
    var v;
    const t = this._buildAnnotations(e);
    if (t.length === 0) return null;
    const o = e.raw.split(`
`);
    let r = o.length - 1;
    for (let c = o.length - 1; c >= 0; c--)
      if (o[c].trim() === "}") {
        r = c;
        break;
      }
    const s = o.find((c) => c.trim().startsWith('"')), i = ((v = s == null ? void 0 : s.match(/^(\s+)/)) == null ? void 0 : v[1]) ?? "  ", n = (c) => a`<span class="jv-line">${c + `
`}</span>`, h = ({ prop: c, kind: b }) => a`<span class="jv-line jv-line--ghost jv-line--${b}">${i}<span class="jv-ghost-pill">${b === "error" ? "✗ missing" : "+ add"}</span> &quot;${c}&quot;: ${this._exampleValue(c)}${`
`}</span>`;
    return a`
            <div class="examples-block">
                <strong class="examples-block__title">Suggested fix</strong>
                <p class="examples-block__desc">
                    The block below shows your current markup with all flagged fields added inline —
                    addressing all of the errors and warnings above, not just the last one.
                    These are illustrative examples only; review and adjust any placeholder values
                    to ensure they are accurate and valid for your content before publishing.
                </p>
                <div class="json-viewer">
                    <div class="json-viewer__header">JSON — ${e.type}</div>
                    <pre class="json-viewer__pre"><code>${[
      ...o.slice(0, r).map(n),
      ...t.map(h),
      ...o.slice(r).map(n)
    ]}</code></pre>
                </div>
            </div>
        `;
  }
  _renderSourceMeta(e) {
    var r, s;
    const t = e.location ? a`<span class="source-location source-location--${e.location}">&lt;${e.location}&gt;</span>` : null, o = e.location === "head" ? a`<span class="source-note source-note--positive">Correctly placed — Google recommends JSON-LD in <code>&lt;head&gt;</code> for fastest discovery.</span>` : e.location === "body" ? a`<span class="source-note source-note--warning">Found in <code>&lt;body&gt;</code> — consider moving to <code>&lt;head&gt;</code> for better search engine compatibility.</span>` : null;
    return (r = this._result) != null && r.hasTemplate && ((s = this._result) != null && s.documentType) ? a`
                <div class="source-meta">
                    <div class="source-meta__row">
                        ${t}${o}
                    </div>
                    <div class="source-meta__row">
                        <span class="source-note">Template: <strong>${this._result.documentType}</strong> — this schema may originate from <code>Views/${this._result.documentType}.cshtml</code>, a partial view, or a layout used by that template.</span>
                    </div>
                </div>
            ` : a`
            <div class="source-meta source-meta--unknown">
                ${t || o ? a`<div class="source-meta__row">${t}${o}</div>` : null}
                <div class="source-meta__row">
                    <span class="source-note source-note--muted">Source unknown — this block may be injected by an external tool, plugin, or script tag not tied to a Razor template.</span>
                </div>
            </div>
        `;
  }
  _renderRichResultSection(e) {
    if (!e.richResultStatus || e.richResultStatus === "unknown") return null;
    const t = e.richResultStatus === "eligible", o = T[e.type] ?? null, r = e.richResultMissingFields ?? [];
    return a`
            <div class="rich-result-section rich-result-section--${e.richResultStatus}">
                <div class="rich-result-header">
                    <span class="rich-result-badge rich-result-badge--${e.richResultStatus}">
                        ${t ? "✓" : "✗"} Google Rich Results
                    </span>
                    ${t ? a`<span class="rich-result-msg">This block meets Google's requirements for <strong>${e.type}</strong> rich results.</span>` : a`<span class="rich-result-msg">Missing <strong>${r.length}</strong> required field${r.length !== 1 ? "s" : ""} for Google rich results.</span>`}
                    ${o ? a`<uui-button look="primary" href=${o} target="_blank" compact>
                               <span class="btn-content">Google docs ${p}</span>
                           </uui-button>` : null}
                </div>
                ${!t && r.length ? a`<p class="rich-result-missing">
                          Required: ${r.map((s, i) => a`<code class="prop-name">${s}</code>${i < r.length - 1 ? a`, ` : null}`)}
                      </p>` : null}
            </div>
        `;
  }
  _renderBlock(e) {
    const t = this._blockStatus(e), o = t.charAt(0).toUpperCase() + t.slice(1), s = ["Unknown", "Invalid JSON"].includes(e.type) ? null : `https://schema.org/${e.type}`, i = this._collapsedBlocks.has(e.index);
    return a`
            <uui-box
                class="block-box block-box--${t}${i ? " block-box--collapsed" : ""}"
            >
                <div slot="headline" class="block-headline">
                    <span
                        class="block-status-badge block-status-badge--${t}"
                    >
                        ${o}
                    </span>
                    Block ${e.index}: ${e.type}
                </div>

                ${s ? a`
                          <uui-button
                              slot="header-actions"
                              look="outline"
                              href=${s}
                              target="_blank"
                              label=${"schema.org/" + e.type}
                              title=${"View schema.org documentation for " + e.type + " (opens in a new tab)"}
                              compact
                          >
                              <span class="btn-content">
                                  schema.org ${p}
                              </span>
                          </uui-button>
                          <span
                              slot="header-actions"
                              class="header-btn-sep"
                          ></span>
                      ` : null}

                <uui-button
                    slot="header-actions"
                    look="outline"
                    compact
                    @click=${() => this._toggleCollapse(e.index)}
                    title=${i ? "Expand this block" : "Collapse this block"}
                >
                    <span class="btn-content">
                        ${i ? "Expand" : "Collapse"}
                        ${m(!i)}
                    </span>
                </uui-button>

                ${i ? null : a`
                          ${this._renderSourceMeta(e)}
                          ${this._renderRichResultSection(e)}
                          ${this._renderJsonBlock(e)}
                          ${e.errors.length ? a`
                                    <uui-alert color="danger" headline="Errors">
                                        <p
                                            class="alert-subtitle alert-subtitle--danger"
                                        >
                                            The following issues prevent this
                                            block from being recognised as valid
                                            structured data by search engines.
                                        </p>
                                        <ul class="msg-list">
                                            ${e.errors.map(
      (n, h) => this._renderMessage(
        n,
        h + 1,
        "error"
      )
    )}
                                        </ul>
                                    </uui-alert>
                                ` : null}
                          ${e.warnings.length ? a`
                                    <uui-alert
                                        color="warning"
                                        headline="Recommendations"
                                    >
                                        <p
                                            class="alert-subtitle alert-subtitle--warning"
                                        >
                                            The following properties are
                                            missing. Adding them improves
                                            eligibility for rich results in
                                            Google Search.
                                        </p>
                                        <ul class="msg-list">
                                            ${e.warnings.map(
      (n, h) => this._renderMessage(
        n,
        h + 1,
        "warning"
      )
    )}
                                        </ul>
                                    </uui-alert>
                                ` : null}
                          ${this._renderExamplesBlock(e)}
                      `}
            </uui-box>
        `;
  }
  _renderFetchErrorAlert() {
    const e = this._result.fetchError, t = this._result.url, o = e.includes("404");
    return a`
            <uui-alert color="warning" headline="Could not fetch page">
                <p class="state-msg">${e}</p>
                ${t ? a`
                          <div class="fetch-url-box">
                              <span class="fetch-url-label">URL attempted</span>
                              <code class="fetch-url-code">${t}</code>
                          </div>
                      ` : null}
                ${o ? a`
                          <div class="fetch-hint-box">
                              <strong>Tip:</strong> Check
                              <strong>Content &rsaquo; Culture &amp; Hostnames</strong>
                              for this node and ensure a valid hostname is assigned. In
                              local development, uSchema rewrites the URL to match the
                              running server — if you still see a 404, confirm the page
                              has a template assigned and is accessible at the URL above.
                          </div>
                      ` : null}
            </uui-alert>
        `;
  }
  render() {
    var i;
    if (this._loading)
      return a`
                <div class="loader"><uui-loader></uui-loader></div>
            `;
    if (this._error)
      return a`
                <uui-alert color="danger">${this._error}</uui-alert>
            `;
    if (!this._result)
      return a`
                <uui-alert>No result.</uui-alert>
            `;
    const e = this._result.published && !this._result.fetchError, t = e ? this._filteredBlocks() : [], o = e ? this._getDuplicateTypes() : [], { summary: r } = this._result, s = e ? r.valid + r.invalid + r.warnings : 0;
    return a`
            <div class="page-header">
                <div class="page-header-main">
                    <div>
                        <h3 class="page-title">
                            <strong>uSchema:</strong>
                            JSON-LD Schema Markup Validator
                        </h3>
                        <p class="page-description">
                            Validates all
                            <code>application/ld+json</code>
                            script blocks found on this page against schema.org
                            requirements and Google's rich result criteria.
                        </p>
                    </div>
                </div>
                <div class="header-actions">
                    ${e && this._result.url ? a`
                              <uui-button
                                  look="outline"
                                  href=${this._result.url}
                                  target="_blank"
                                  title="Open the published page in a new tab"
                              >
                                  <span class="btn-content"
                                      >View page ${p}</span
                                  >
                              </uui-button>
                          ` : null}
                    <uui-button
                        look="primary"
                        color="positive"
                        @click=${this._revalidate}
                        ?disabled=${this._loading}
                        title="Re-run validation against the current published page"
                    >
                        <span class="btn-content"
                            >Re-validate ${f}</span
                        >
                    </uui-button>
                </div>
            </div>

            ${this._historicalIndex !== null ? a`
                <div class="exec-card historical-card">
                    <div class="historical-card__header">
                        <svg class="historical-card__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 8l0 4l2 2"/>
                            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
                        </svg>
                        <div class="historical-card__content">
                            <span class="historical-card__label">Historical scan</span>
                            <span class="historical-card__date">${new Date(((i = this._history[this._historicalIndex]) == null ? void 0 : i.scannedAt) ?? "").toLocaleString()}</span>
                            <span class="historical-card__meta">Entry ${this._historicalIndex + 1} of ${this._history.length} — not the latest result</span>
                        </div>
                        <uui-button look="primary" color="positive" compact @click=${() => this._revalidate()}>
                            <span class="btn-content">Re-validate ${f}</span>
                        </uui-button>
                    </div>
                </div>
            ` : null}

            ${this._renderHistory()}

            ${this._result.fetchError ? this._renderFetchErrorAlert() : null}

            ${this._result.published ? null : a`
                      <uui-alert headline="Page not published">
                          <p class="state-msg">
                              This page hasn't been published yet — there is no
                              public URL to validate.
                          </p>
                          <p class="state-hint">
                              Publish the page from the <strong>Info</strong>
                              tab, then click <strong>Re-validate</strong> above
                              to check its schema markup.
                          </p>
                      </uui-alert>
                  `}

            ${e ? a`
                      ${this._renderSummary()}

                      ${o.length > 0 ? a`
                      <h4 class="section-heading">
                          <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" viewBox="0 0 24 24">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                              <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                          </svg>
                          Page schema data duplication
                          <span class="section-heading-count">
                              (
                              <strong>${o.length}</strong>
                              duplicate schema
                              type${o.length !== 1 ? "s" : ""} found)
                          </span>
                      </h4>
                      ` : null}

                      ${o.length > 0 ? a`
                                <uui-box class="block-box block-box--warning">
                                    <div slot="headline" class="block-headline">
                                        <span
                                            class="block-status-badge block-status-badge--warning"
                                        >
                                            Warning
                                        </span>
                                        Schema Consistency Issues
                                    </div>
                                    <p class="msg-detail dup-description">
                                        The following schema types appear more
                                        than once on this page. Search engines
                                        expect most types to be declared only
                                        once — duplicate blocks may confuse
                                        crawlers or cause one to be silently
                                        ignored.
                                    </p>
                                    <ul class="dup-list">
                                        ${o.map(
      (n) => a`<li>
                                                    <code class="prop-name"
                                                        >${n}</code
                                                    >
                                                </li>`
    )}
                                    </ul>
                                </uui-box>
                            ` : null}

                      <h4 class="section-heading">
                          <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" viewBox="0 0 24 24">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M7 8l-4 4l4 4" />
                              <path d="M17 8l4 4l-4 4" />
                              <path d="M14 4l-4 16" />
                          </svg>
                          Page schema data analysis
                          <span class="section-heading-count">
                              (
                              <strong>${s}</strong>
                              schema block${s !== 1 ? "s" : ""} detected on
                              this page)
                          </span>
                      </h4>

                      ${this._result.summary.none ? a`
                                    <uui-box headline="No schema markup found" class="no-schema-box">
                                        <p class="state-msg">
                                            No <code>application/ld+json</code> blocks were found on this page.
                                        </p>
                                        ${this._result.suggestedSchemaType ? a`
                                                  <p class="state-hint suggestion-lead">
                                                      Based on the
                                                      <strong>${this._result.documentType}</strong>
                                                      document type, we suggest adding a
                                                      <strong>${this._result.suggestedSchemaType}</strong>
                                                      schema block. Here's a starting example:
                                                  </p>
                                                  <div class="json-viewer">
                                                      <div class="json-viewer__header">JSON — ${this._result.suggestedSchemaType} example</div>
                                                      <pre class="json-viewer__pre"><code class="json-viewer__code">${P[this._result.suggestedSchemaType] ?? `{
  "@context": "https://schema.org",
  "@type": "${this._result.suggestedSchemaType}"
}`}</code></pre>
                                                  </div>
                                              ` : null}
                                    </uui-box>
                                    <uui-box headline="Configure schema type suggestions" class="no-schema-box">
                                        <p class="appsettings-tip__body">
                                            Add a <code>uSchema</code> section to your <code>appsettings.json</code>
                                            to enable suggestions. Keys are your Umbraco document type aliases;
                                            values are the schema.org types uSchema will recommend when a page of
                                            that type has no markup. The example below is illustrative — review your
                                            document type aliases carefully and ensure the schema types you assign are
                                            appropriate for the content before going live.
                                        </p>
                                        <div class="json-viewer">
                                            <div class="json-viewer__header">JSON (appsettings.json)</div>
                                            <pre class="json-viewer__pre"><code class="json-viewer__code">"uSchema": {
  "DocumentTypeSchemaMap": {
    "blogPost": "Article",   // document type alias → schema.org type
    "product": "Product"
  }
}</code></pre>
                                        </div>
                                    </uui-box>
                                ` : null}
                          ${t.length === 0 && this._activeFilter ? a`
                                    <uui-alert>
                                        No ${this._activeFilter} blocks on this
                                        page.
                                    </uui-alert>
                                ` : t.map((n) => this._renderBlock(n))}
                  ` : null}
        `;
  }
};
l.styles = y`
        :host {
            display: block;
            padding: var(--uui-size-layout-1);
        }

        /* ── Page header ─────────────────────────────────────────── */

        .page-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: var(--uui-size-space-4);
            margin-bottom: var(--uui-size-layout-1);
        }

        .page-header-main {
            flex: 1;
        }

        .page-title {
            margin: 0 0 var(--uui-size-space-2);
            font-size: var(--uui-type-large-size, 18px);
            font-weight: 700;
            color: var(--uui-color-text, #1a1a1a);
        }

        .page-description {
            margin: 0;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
            line-height: 1.5;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            flex-shrink: 0;
            margin-top: var(--uui-size-space-3);
        }

        .loader {
            display: flex;
            justify-content: center;
            padding: var(--uui-size-layout-3);
        }

        /* ── Summary row ─────────────────────────────────────────── */

        /* ── Stat cards ─────────────────────────────────────────── */

        .stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: var(--uui-size-space-3);
            margin-bottom: var(--uui-size-space-4);
        }

        .stat-card {
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--uui-size-space-3);
            padding: var(--uui-size-space-4);
            border-radius: var(--uui-border-radius, 3px);
            background: var(--uui-color-surface, #fff);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            overflow: hidden;
            transition: opacity 0.15s ease;
        }

        .stat-card--valid,
        .stat-card--warning,
        .stat-card--invalid {
            cursor: pointer;
            user-select: none;
        }

        .stat-card--valid:hover,
        .stat-card--warning:hover,
        .stat-card--invalid:hover {
            border-color: var(--uui-color-border-emphasis, #a1a1aa);
        }

        .stat-card--dimmed { opacity: 0.4; }
        .stat-card--active { border-width: 2px; }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
        }

        .stat-card--valid::before    { background: #27ae60; }
        .stat-card--warning::before  { background: #b7770d; }
        .stat-card--invalid::before  { background: #c0392b; }
        .stat-card--total::before    { background: #2471a3; }

        .stat-card__icon {
            width: 36px;
            height: 36px;
            flex-shrink: 0;
        }

        .stat-card__icon svg { width: 100%; height: 100%; }

        .stat-card--valid .stat-card__icon    { color: #27ae60; }
        .stat-card--warning .stat-card__icon  { color: #b7770d; }
        .stat-card--invalid .stat-card__icon  { color: #c0392b; }
        .stat-card--total .stat-card__icon    { color: #2471a3; }

        .stat-card__info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .stat-card__value {
            font-size: 26px;
            font-weight: 800;
            line-height: 1;
            color: var(--uui-color-text, #1a1a1a);
        }

        .stat-card__label {
            font-size: 13px;
            font-weight: 600;
            color: var(--uui-color-text, #1a1a1a);
            white-space: nowrap;
        }

        /* ── Filter row ──────────────────────────────────────────── */

        .filter-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--uui-size-space-3);
            margin-bottom: var(--uui-size-layout-1);
            flex-wrap: wrap;
            min-height: 36px;
        }

        .filter-row__hint { flex: 1; }

        .summary-actions {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            flex-wrap: wrap;
        }

        .filter-hint {
            margin: 0;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
        }

        /* ── exec-card base ──────────────────────────────────────── */

        .exec-card {
            background: var(--uui-color-surface, #fff);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            border-radius: var(--uui-border-radius, 3px);
            padding: var(--uui-size-space-4);
        }

        /* ── Historical context banner ───────────────────────────── */

        .historical-card {
            margin-bottom: var(--uui-size-layout-1);
        }

        .historical-card__header {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-4);
        }

        .historical-card__icon {
            width: 22px;
            height: 22px;
            flex-shrink: 0;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .historical-card__content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .historical-card__label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .historical-card__date {
            font-size: 14px;
            font-weight: 700;
            color: var(--uui-color-text, #1a1a1a);
        }

        .historical-card__meta {
            font-size: 12px;
            color: var(--uui-color-text-alt, #6b7280);
        }

        /* ── History section ─────────────────────────────────────── */

        .history-section {
            margin-bottom: var(--uui-size-layout-1);
        }

        .section-heading__icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .history-table-card {
            margin-bottom: var(--uui-size-layout-1);
            padding: 0;
            overflow: hidden;
        }

        .history-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .history-table th,
        .history-table td {
            padding: 8px 12px;
            text-align: left;
            border-bottom: 1px solid var(--uui-color-border, #d8d7d9);
        }

        .history-table thead th {
            background: var(--uui-color-surface, #fff);
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .history-table thead th.th--valid    { color: #1a7a4a; }
        .history-table thead th.th--warnings { color: #b7770d; }
        .history-table thead th.th--invalid  { color: #c0392b; }

        .history-table tbody tr:last-child td { border-bottom: none; }
        .history-table tbody tr:first-child td { font-weight: 700; }

        .history-row--active td {
            background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 6%, transparent);
        }

        .history-actions {
            display: flex;
            gap: var(--uui-size-space-2);
            justify-content: flex-end;
            white-space: nowrap;
        }

        .history-load-btn {
            min-width: 62px;
        }

        .count-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            padding: 1px 7px;
            border-radius: 3px;
        }

        .count-badge--valid    { background: rgba(39, 174, 96, 0.12);  color: #1a7a4a; }
        .count-badge--warnings { background: rgba(183, 119, 13, 0.12); color: #b7770d; }
        .count-badge--invalid  { background: rgba(192, 57, 43, 0.12);  color: #c0392b; }

        .history-footer {
            padding: var(--uui-size-space-3) var(--uui-size-space-4) var(--uui-size-space-4);
            display: flex;
            justify-content: flex-start;
        }

        /* ── Block boxes ─────────────────────────────────────────── */

        .block-box {
            margin-bottom: var(--uui-size-layout-1);
        }

        .block-box--valid::part(header) {
            background-color: color-mix(
                in srgb,
                var(--uui-color-positive, #3544b1) 12%,
                transparent
            );
        }

        .block-box--warning::part(header) {
            background-color: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 20%,
                transparent
            );
        }

        .block-box--invalid::part(header) {
            background-color: color-mix(
                in srgb,
                var(--uui-color-danger, #d42054) 12%,
                transparent
            );
        }

        .block-box--collapsed {
            --uui-box-default-padding: 0;
        }

        .block-headline {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
        }

        .block-status-badge {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 2px 7px;
            border-radius: var(--uui-border-radius, 3px);
        }

        .block-status-badge--valid {
            background-color: color-mix(
                in srgb,
                var(--uui-color-positive, #3544b1) 15%,
                transparent
            );
            color: var(--uui-color-positive, #3544b1);
        }

        .block-status-badge--warning {
            background-color: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 35%,
                transparent
            );
            color: var(--uui-color-text, #1a1a1a);
        }

        .block-status-badge--invalid {
            background-color: color-mix(
                in srgb,
                var(--uui-color-danger, #d42054) 15%,
                transparent
            );
            color: var(--uui-color-danger, #d42054);
        }

        /* ── JSON viewer (annotated code block) ─────────────────── */

        /* ── Source meta bar ─────────────────────────────────────── */

        .source-meta {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin: 0 0 var(--uui-size-space-4);
            color: var(--uui-color-text-alt, #6b7280);
        }

        .source-meta__row {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .source-note {
            font-size: 14px;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .source-note--positive {
            color: var(--uui-color-positive, #0a7a4e);
        }

        .source-note--warning {
            color: var(--uui-color-warning-standalone, #b8870f);
        }

        .source-note--muted {
            font-style: italic;
        }

        .source-location {
            display: inline-block;
            font-family: var(--uui-font-monospace, monospace);
            font-size: 10px;
            font-weight: 600;
            padding: 1px 6px;
            border-radius: 3px;
            background: var(--uui-color-surface-alt, #f3f3f5);
            border: 1px solid rgba(0, 0, 0, 0.12);
            color: var(--uui-color-text-alt, #6b7280);
            flex-shrink: 0;
        }

        .source-location--head {
            color: var(--uui-color-positive, #0a7a4e);
            background: color-mix(
                in srgb,
                var(--uui-color-positive, #0a7a4e) 8%,
                transparent
            );
            border-color: color-mix(
                in srgb,
                var(--uui-color-positive, #0a7a4e) 25%,
                transparent
            );
        }

        .source-location--body {
            color: var(--uui-color-warning-standalone, #b8870f);
            background: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 12%,
                transparent
            );
            border-color: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 35%,
                transparent
            );
        }

        .state-msg {
            margin: 0 0 4px;
            font-size: var(--uui-type-default-size, 13px);
        }

        .state-hint {
            margin: 6px 0 0;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
        }

        .fetch-url-box {
            margin: 10px 0 0;
            padding: 8px 10px;
            background: rgba(0, 0, 0, 0.06);
            border-radius: var(--uui-border-radius, 3px);
            border-left: 3px solid rgba(0, 0, 0, 0.18);
        }

        .fetch-url-label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 4px;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .fetch-url-code {
            font-family: var(--uui-font-monospace, monospace);
            font-size: 11px;
            word-break: break-all;
            color: var(--uui-color-text, #1a1a1a);
        }

        .fetch-hint-box {
            margin: 8px 0 0;
            padding: 8px 10px;
            background: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 15%,
                transparent
            );
            border-radius: var(--uui-border-radius, 3px);
            font-size: 12px;
            line-height: 1.5;
        }

        /* ── Examples block ──────────────────────────────────────── */

        .examples-block {
            margin-top: var(--uui-size-space-5);
        }

        .examples-block__title {
            display: block;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text, #1a1a1a);
            margin-bottom: var(--uui-size-space-1);
        }

        .examples-block__desc {
            margin: 0 0 var(--uui-size-space-3);
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
        }

        .json-viewer {
            border-radius: var(--uui-border-radius, 3px);
            overflow: hidden;
            font-family: var(--uui-font-monospace, monospace);
            font-size: 14px;
            line-height: 1.6;
            border: 1px solid rgba(0, 0, 0, 0.25);
            margin: var(--uui-size-space-4) 0 0;
        }

        .json-viewer__header {
            padding: 6px 12px;
            background: var(--uui-color-surface-alt, #f3f3f5);
            border-bottom: 1px solid rgba(0, 0, 0, 0.25);
            font-family: var(--uui-font-monospace, monospace);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .json-viewer__pre {
            margin: 0;
            padding: 0;
            background: #f3f3f5;
            color: var(--uui-color-text, #1a1a1a);
            overflow-x: auto;
            white-space: pre;
            font-family: inherit;
        }

        .json-viewer__pre code {
            display: block;
            padding-top: var(--uui-size-space-4);
            padding-bottom: var(--uui-size-space-4);
        }

        .json-viewer__code {
            padding: var(--uui-size-space-4) 16px;
        }

        .jv-line {
            display: block;
            padding: 0 16px;
            min-height: 1.6em;
        }

        .jv-line--ghost {
            font-style: italic;
        }

        .jv-line--ghost.jv-line--error {
            background: color-mix(
                in srgb,
                var(--uui-color-danger, #d42054) 8%,
                transparent
            );
            color: var(--uui-color-danger, #d42054);
        }

        .jv-line--ghost.jv-line--warning {
            background: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 18%,
                transparent
            );
            color: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 60%,
                #000
            );
        }

        .jv-ghost-pill {
            display: inline-block;
            font-size: 9px;
            font-weight: 700;
            font-style: normal;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 1px 5px;
            border-radius: 3px;
            margin-right: 6px;
        }

        .jv-line--error .jv-ghost-pill {
            background: color-mix(
                in srgb,
                var(--uui-color-danger, #d42054) 15%,
                transparent
            );
            color: var(--uui-color-danger, #d42054);
        }

        .jv-line--warning .jv-ghost-pill {
            background: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 35%,
                transparent
            );
            color: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 60%,
                #000
            );
        }

        /* ── Button icon layout ──────────────────────────────────── */

        .btn-content {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .btn-icon {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
            vertical-align: middle;
        }

        .btn-icon--up {
            transform: rotate(180deg);
        }

        /* ── Section heading ─────────────────────────────────────── */

        .section-heading {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            margin: var(--uui-size-layout-1) 0 var(--uui-size-space-4);
            font-size: 15px;
            font-weight: 700;
            color: var(--uui-color-text, #1a1a1a);
            padding-bottom: var(--uui-size-space-3);
            border-bottom: 2px solid var(--uui-color-border, #d8d7d9);
        }

        .section-heading uui-button {
            margin-left: auto;
            flex-shrink: 0;
        }

        .section-heading-count {
            font-size: 13px;
            font-weight: 400;
            color: var(--uui-color-text-alt, #6b7280);
            margin-left: 2px;
        }

        /* ── Duplicate types card ────────────────────────────────── */

        .dup-description {
            margin-bottom: var(--uui-size-space-4);
        }

        .dup-list {
            display: flex;
            flex-wrap: wrap;
            gap: var(--uui-size-space-3);
            list-style: none;
            padding: 0;
            margin: var(--uui-size-layout-1) 0 0;
        }

        /* ── Block header button separator ───────────────────────── */

        .header-btn-sep {
            display: inline-block;
            width: 1px;
            height: 16px;
            background-color: transparent;
            align-self: center;
            flex-shrink: 0;
            margin-inline: var(--uui-size-space-3);
        }

        /* ── Rich Results section ────────────────────────────────── */

        .rich-result-section {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-3);
            padding: var(--uui-size-space-4);
            border-radius: var(--uui-border-radius, 3px);
            margin-bottom: var(--uui-size-space-4);
            border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .rich-result-section--eligible {
            background: color-mix(in srgb, var(--uui-color-positive, #0a7a4e) 6%, transparent);
            border-color: color-mix(in srgb, var(--uui-color-positive, #0a7a4e) 20%, transparent);
        }

        .rich-result-section--ineligible {
            background: color-mix(in srgb, var(--uui-color-warning, #ffc600) 8%, transparent);
            border-color: color-mix(in srgb, var(--uui-color-warning, #ffc600) 30%, transparent);
        }

        .rich-result-header {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            flex-wrap: wrap;
        }

        .rich-result-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 2px 7px;
            border-radius: var(--uui-border-radius, 3px);
            flex-shrink: 0;
        }

        .rich-result-badge--eligible {
            background: color-mix(in srgb, var(--uui-color-positive, #0a7a4e) 15%, transparent);
            color: var(--uui-color-positive, #0a7a4e);
        }

        .rich-result-badge--ineligible {
            background: color-mix(in srgb, var(--uui-color-warning, #ffc600) 30%, transparent);
            color: var(--uui-color-text, #1a1a1a);
        }

        .rich-result-msg {
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
            flex: 1;
        }

        .rich-result-missing {
            margin: 0;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
        }

        /* ── Appsettings tip ─────────────────────────────────────── */

        .no-schema-box {
            margin-top: var(--uui-size-space-3);
        }

        .appsettings-tip__body {
            margin: 0 0 var(--uui-size-space-3);
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
        }

        .appsettings-tip__pre {
            margin: 0;
            padding: var(--uui-size-space-4);
            background: var(--uui-color-surface, white);
            border: 1px solid rgba(0, 0, 0, 0.10);
            border-radius: var(--uui-border-radius, 3px);
            font-family: var(--uui-font-monospace, monospace);
            font-size: 12px;
            line-height: 1.6;
            white-space: pre;
            overflow-x: auto;
            color: var(--uui-color-text, #1a1a1a);
        }

        /* ── Message items ───────────────────────────────────────── */

        .alert-subtitle {
            margin: var(--uui-size-space-5) 0 0;
            font-size: var(--uui-type-default-size, 14px);
            padding: 10px;
            border-radius: var(--uui-border-radius, 3px);
            max-width: max-content;
        }

        .alert-subtitle--danger {
            background-color: color-mix(
                in srgb,
                var(--uui-color-danger, #d42054) 10%,
                transparent
            );
        }

        .alert-subtitle--warning {
            background-color: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 18%,
                transparent
            );
        }

        .msg-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
        }

        .msg-item {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-3);
            padding: var(--uui-size-space-5) 0;
        }

        .msg-item:not(:first-child) {
            border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .msg-item:last-child {
            padding-bottom: 0;
        }

        /* ── Message header: "1. Error/Warning: title" ────────── */

        .msg-header {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            flex-wrap: wrap;
        }

        .msg-index {
            font-weight: 600;
            color: var(--uui-color-text-alt, #6b7280);
            flex-shrink: 0;
            font-size: var(--uui-type-default-size, 14px);
        }

        .msg-kind {
            flex-shrink: 0;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 2px 6px;
            border-radius: var(--uui-border-radius, 3px);
        }

        .msg-kind--error {
            background-color: color-mix(
                in srgb,
                var(--uui-color-danger, #d42054) 15%,
                transparent
            );
            color: var(--uui-color-danger, #d42054);
        }

        .msg-kind--warning {
            background-color: color-mix(
                in srgb,
                var(--uui-color-warning, #ffc600) 25%,
                transparent
            );
            color: var(--uui-color-text, #1a1a1a);
        }

        .msg-title {
            font-size: var(--uui-type-default-size, 14px);
        }

        .block-box block-box--warning {
            margin: var(--uui-size-layout-1) 0;
        }

        .prop-name {
            font-family: var(--uui-font-monospace, monospace);
            font-size: 0.9em;
            font-style: normal;
            font-weight: 700;
            background: rgba(0, 0, 0, 0.08);
            padding: 8px;
            border-radius: var(--uui-border-radius, 3px);
        }

        .msg-button {
            margin-left: auto;
            flex-shrink: 0;
        }

        .msg-detail {
            margin: 0;
            font-size: var(--uui-type-default-size, 14px);
            line-height: 1.5;
        }

        .msg-example {
            margin: 0;
            font-family: var(--uui-font-monospace, monospace);
            font-size: 12px;
            background: rgba(0, 0, 0, 0.06);
            padding: var(--uui-size-space-4) var(--uui-size-space-5);
            border-radius: var(--uui-border-radius, 4px);
            border-left: 3px solid rgba(0, 0, 0, 0.15);
            word-break: break-all;
            white-space: pre-wrap;
            overflow-x: auto;
        }
    `;
d([
  u()
], l.prototype, "_loading", 2);
d([
  u()
], l.prototype, "_result", 2);
d([
  u()
], l.prototype, "_error", 2);
d([
  u()
], l.prototype, "_activeFilter", 2);
d([
  u()
], l.prototype, "_collapsedBlocks", 2);
d([
  u()
], l.prototype, "_history", 2);
d([
  u()
], l.prototype, "_historyExpanded", 2);
d([
  u()
], l.prototype, "_historyLoading", 2);
d([
  u()
], l.prototype, "_historicalIndex", 2);
l = d([
  _("schema-preview-workspace-view")
], l);
const U = l;
export {
  l as SchemaPreviewWorkspaceView,
  U as default
};
//# sourceMappingURL=workspace-view.element-CoKGcpq7.js.map
