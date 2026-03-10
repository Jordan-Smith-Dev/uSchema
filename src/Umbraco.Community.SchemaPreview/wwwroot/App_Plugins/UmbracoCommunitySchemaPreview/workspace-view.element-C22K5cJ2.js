import { LitElement as f, html as r, css as v, state as g, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as k } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as y } from "@umbraco-cms/backoffice/document";
import { UMB_AUTH_CONTEXT as w } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as _ } from "@umbraco-cms/backoffice/notification";
var $ = Object.defineProperty, z = Object.getOwnPropertyDescriptor, u = (e, t, a, i) => {
  for (var o = i > 1 ? void 0 : i ? z(t, a) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (o = (i ? l(t, a, o) : l(o)) || o);
  return i && o && $(t, a, o), o;
};
function C(e) {
  return e === "Missing @context" ? {
    title: r`
                Missing
                <code class="prop-name">@context</code>
            `,
    detail: "Every JSON-LD block must declare a context so search engines know how to interpret the properties.",
    example: '"@context": "https://schema.org"',
    docsUrl: "https://schema.org/docs/gs1.html"
  } : e === "Missing @type" ? {
    title: r`
                Missing
                <code class="prop-name">@type</code>
            `,
    detail: r`
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
      title: r`
                is required for
                <code class="prop-name">BreadcrumbList</code>
            `,
      propertyName: "itemListElement",
      detail: r`
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
      title: r`
                is required for
                <code class="prop-name">FAQPage</code>
            `,
      propertyName: "mainEntity",
      detail: r`
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
const S = "/umbraco/umbracocommunityschemapreview/api/v1", E = r`
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
`, p = r`
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
`, b = (e) => r`
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
`;
let c = class extends k(f) {
  constructor() {
    super(...arguments), this._loading = !0, this._result = null, this._error = null, this._activeFilter = null, this._collapsedBlocks = /* @__PURE__ */ new Set(), this._unique = null;
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(w, (e) => {
      this._tokenProvider = e == null ? void 0 : e.getOpenApiConfiguration().token;
    }), this.consumeContext(_, (e) => {
      this._notificationContext = e;
    }), this.consumeContext(y, async (e) => {
      var a;
      const t = (a = e == null ? void 0 : e.getUnique) == null ? void 0 : a.call(e);
      if (!t) {
        this._error = "Could not determine content key from workspace.", this._loading = !1;
        return;
      }
      this._unique = t, await this._validate(t);
    });
  }
  async _validate(e) {
    this._loading = !0, this._error = null, this._result = null, this._activeFilter = null, this._collapsedBlocks = /* @__PURE__ */ new Set();
    try {
      const t = this._tokenProvider ? await this._tokenProvider() : void 0, a = await fetch(`${S}/validate/key/${e}`, {
        headers: {
          Accept: "application/json",
          ...t ? { Authorization: `Bearer ${t}` } : {}
        }
      });
      if (!a.ok)
        throw new Error(
          `Validation request failed: ${a.status} ${a.statusText}`
        );
      this._result = await a.json(), this._result && this._notifyResult(this._result);
    } catch (t) {
      this._error = t instanceof Error ? t.message : "An unexpected error occurred.";
    } finally {
      this._loading = !1;
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
      (a) => this._collapsedBlocks.has(a.index)
    ), t = new Set(this._collapsedBlocks);
    for (const a of this._result.blocks)
      e ? t.delete(a.index) : t.add(a.index);
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
    const e = this._result.summary, t = this._activeFilter, a = (i) => t === null ? "filter-tag" : t === i ? "filter-tag filter-tag--active" : "filter-tag filter-tag--dimmed";
    return r`
            <div class="summary-row">
                <div class="summary-filters">
                    <uui-tag
                        color="positive"
                        class=${a("valid")}
                        @click=${() => this._toggleFilter("valid")}
                        title="Click to filter by valid blocks"
                    >
                        Valid: ${e.valid}
                    </uui-tag>

                    <uui-tag
                        color="warning"
                        class=${a("warning")}
                        @click=${() => this._toggleFilter("warning")}
                        title="Click to filter by warning blocks"
                    >
                        Warnings: ${e.warnings}
                    </uui-tag>

                    <uui-tag
                        color="danger"
                        class=${a("invalid")}
                        @click=${() => this._toggleFilter("invalid")}
                        title="Click to filter by invalid blocks"
                    >
                        Invalid: ${e.invalid}
                    </uui-tag>
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
                            ${b(this._allCollapsed())}
                        </span>
                    </uui-button>
                    ${this._result.url ? r`
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

            ${t ? r`
                      <p class="filter-hint">
                          Showing ${t} blocks only &mdash; click the tag again
                          to clear.
                      </p>
                  ` : null}
        `;
  }
  _renderMessage(e, t, a) {
    const i = C(e), o = i.propertyName ? r`
                  <code class="prop-name">"${i.propertyName}"</code>
                  ${i.title}
              ` : i.title;
    return r`
            <li class="msg-item">
                <div class="msg-header">
                    <span class="msg-index">${t}.</span>
                    <span class="msg-kind msg-kind--${a}">
                        ${a === "error" ? "Error" : "Warning"}
                    </span>
                    <strong class="msg-title">${o}</strong>
                    ${i.docsUrl ? r`
                              <uui-button
                                  look="primary"
                                  href=${i.docsUrl}
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
                ${i.detail ? r`
                          <p class="msg-detail">${i.detail}</p>
                      ` : null}
                ${i.example ? r`
                          <pre class="msg-example">${i.example}</pre>
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
    for (const a of e.errors)
      a === "Missing @context" ? t.push({ prop: "@context", kind: "error" }) : a === "Missing @type" && t.push({ prop: "@type", kind: "error" });
    for (const a of e.warnings) {
      const i = a.match(/^Recommended: (\S+)$/);
      i && t.push({ prop: i[1], kind: "warning" });
    }
    return t;
  }
  _renderJsonBlock(e) {
    return r`
            <umb-code-block language="JSON">${e.raw}</umb-code-block>
        `;
  }
  _renderExamplesBlock(e) {
    var h;
    const t = this._buildAnnotations(e);
    if (t.length === 0) return null;
    const a = e.raw.split(`
`);
    let i = a.length - 1;
    for (let n = a.length - 1; n >= 0; n--)
      if (a[n].trim() === "}") {
        i = n;
        break;
      }
    const o = a.find((n) => n.trim().startsWith('"')), s = ((h = o == null ? void 0 : o.match(/^(\s+)/)) == null ? void 0 : h[1]) ?? "  ", l = (n) => r`<span class="jv-line">${n + `
`}</span>`, d = ({ prop: n, kind: m }) => r`<span class="jv-line jv-line--ghost jv-line--${m}">${s}<span class="jv-ghost-pill">${m === "error" ? "✗ missing" : "+ add"}</span> &quot;${n}&quot;: ${this._exampleValue(n)}${`
`}</span>`;
    return r`
            <div class="json-viewer">
                <div class="json-viewer__header">json examples</div>
                <pre class="json-viewer__pre"><code>${[
      ...a.slice(0, i).map(l),
      ...t.map(d),
      ...a.slice(i).map(l)
    ]}</code></pre>
            </div>
        `;
  }
  _renderSourceMeta(e) {
    var i, o;
    const t = e.location ? r`<span class="source-location source-location--${e.location}">&lt;${e.location}&gt;</span>` : null, a = e.location === "head" ? r`<span class="source-note source-note--positive">Correctly placed — Google recommends JSON-LD in <code>&lt;head&gt;</code> for fastest discovery.</span>` : e.location === "body" ? r`<span class="source-note source-note--warning">Found in <code>&lt;body&gt;</code> — consider moving to <code>&lt;head&gt;</code> for better search engine compatibility.</span>` : null;
    return (i = this._result) != null && i.hasTemplate && ((o = this._result) != null && o.documentType) ? r`
                <div class="source-meta">
                    <div class="source-meta__row">
                        ${t}${a}
                    </div>
                    <div class="source-meta__row">
                        <span class="source-note">Template: <strong>${this._result.documentType}</strong> — look for <code>Views/${this._result.documentType}.cshtml</code> or a partial view used by that template.</span>
                    </div>
                </div>
            ` : r`
            <div class="source-meta source-meta--unknown">
                ${t || a ? r`<div class="source-meta__row">${t}${a}</div>` : null}
                <div class="source-meta__row">
                    <span class="source-note source-note--muted">Source unknown — this block may be injected by an external tool, plugin, or script tag not tied to a Razor template.</span>
                </div>
            </div>
        `;
  }
  _renderBlock(e) {
    const t = this._blockStatus(e), a = t.charAt(0).toUpperCase() + t.slice(1), o = ["Unknown", "Invalid JSON"].includes(e.type) ? null : `https://schema.org/${e.type}`, s = this._collapsedBlocks.has(e.index);
    return r`
            <uui-box
                class="block-box block-box--${t}${s ? " block-box--collapsed" : ""}"
            >
                <div slot="headline" class="block-headline">
                    <span
                        class="block-status-badge block-status-badge--${t}"
                    >
                        ${a}
                    </span>
                    Block ${e.index}: ${e.type}
                </div>

                ${o ? r`
                          <uui-button
                              slot="header-actions"
                              look="outline"
                              href=${o}
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
                    title=${s ? "Expand this block" : "Collapse this block"}
                >
                    <span class="btn-content">
                        ${s ? "Expand" : "Collapse"}
                        ${b(!s)}
                    </span>
                </uui-button>

                ${s ? null : r`
                          ${this._renderSourceMeta(e)}
                          ${this._renderJsonBlock(e)}
                          ${e.errors.length ? r`
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
      (l, d) => this._renderMessage(
        l,
        d + 1,
        "error"
      )
    )}
                                        </ul>
                                    </uui-alert>
                                ` : null}
                          ${e.warnings.length ? r`
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
      (l, d) => this._renderMessage(
        l,
        d + 1,
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
    const e = this._result.fetchError, t = this._result.url, a = e.includes("404");
    return r`
            <uui-alert color="warning" headline="Could not fetch page">
                <p class="state-msg">${e}</p>
                ${t ? r`
                          <div class="fetch-url-box">
                              <span class="fetch-url-label">URL attempted</span>
                              <code class="fetch-url-code">${t}</code>
                          </div>
                      ` : null}
                ${a ? r`
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
    if (this._loading)
      return r`
                <div class="loader"><uui-loader></uui-loader></div>
            `;
    if (this._error)
      return r`
                <uui-alert color="danger">${this._error}</uui-alert>
            `;
    if (!this._result)
      return r`
                <uui-alert>No result.</uui-alert>
            `;
    const e = this._result.published && !this._result.fetchError, t = e ? this._filteredBlocks() : [], a = e ? this._getDuplicateTypes() : [], { summary: i } = this._result, o = e ? i.valid + i.invalid + i.warnings : 0;
    return r`
            <div class="page-header">
                <div class="page-header-main">
                    <img
                        class="page-logo"
                        src="/App_Plugins/UmbracoCommunitySchemaPreview/images/uSchema_logo.png"
                        alt="uSchema"
                    />
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
                    ${e && this._result.url ? r`
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
                            >Re-validate ${E}</span
                        >
                    </uui-button>
                </div>
            </div>

            ${this._result.fetchError ? this._renderFetchErrorAlert() : null}

            ${this._result.published ? null : r`
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

            ${e ? r`
                      ${this._renderSummary()}

                      <h4 class="section-heading">
                          Page schema data duplication
                          <span class="section-heading-count">
                              (
                              <strong>${a.length}</strong>
                              duplicate schema
                              type${a.length !== 1 ? "s" : ""} found)
                          </span>
                      </h4>

                      ${a.length > 0 ? r`
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
                                        ${a.map(
      (s) => r`<li>
                                                    <code class="prop-name"
                                                        >${s}</code
                                                    >
                                                </li>`
    )}
                                    </ul>
                                </uui-box>
                            ` : null}

                      <h4 class="section-heading">
                          Page schema data analysis
                          <span class="section-heading-count">
                              (
                              <strong>${o}</strong>
                              schema block${o !== 1 ? "s" : ""} detected on
                              this page)
                          </span>
                      </h4>

                      ${this._result.summary.none ? r`
                                <uui-alert>
                                    No
                                    <code>application/ld+json</code>
                                    script blocks found on this page.
                                </uui-alert>
                            ` : null}
                      ${t.length === 0 && this._activeFilter ? r`
                                <uui-alert>
                                    No ${this._activeFilter} blocks on this
                                    page.
                                </uui-alert>
                            ` : t.map((s) => this._renderBlock(s))}
                  ` : null}
        `;
  }
};
c.styles = v`
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
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-5);
        }

        .page-logo {
            width: 100px;
            height: 100px;
            flex-shrink: 0;
            object-fit: contain;
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

        .summary-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--uui-size-space-4);
            flex-wrap: wrap;
            margin-bottom: var(--uui-size-space-3);
        }

        .summary-filters {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-4);
            flex-wrap: wrap;
        }

        .summary-actions {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            flex-wrap: wrap;
        }

        .filter-tag {
            cursor: pointer;
            user-select: none;
            transition: opacity 0.15s ease;
        }

        .filter-tag--dimmed {
            opacity: 0.35;
        }

        .filter-tag--active {
            opacity: 1;
        }

        .filter-hint {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            margin: var(--uui-size-space-4) 0 var(--uui-size-layout-1);
            padding: var(--uui-size-space-3) var(--uui-size-space-4);
            border-radius: var(--uui-border-radius, 3px);
            background: var(--uui-color-info-subtle, #eff6ff);
            border: 1px solid var(--uui-color-info-emphasis, #93c5fd);
            font-size: var(--uui-type-default-size, 14px);
            color: var(--uui-color-text, #1f2937);
        }

        .filter-hint::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            background: var(--uui-color-info, #3b82f6);
            border-radius: 50%;
            -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='12'/%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'/%3E%3C/svg%3E") center / contain no-repeat;
            mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='12'/%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'/%3E%3C/svg%3E") center / contain no-repeat;
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
            background: #f3f3f5;
            border-bottom: 1px solid rgba(0, 0, 0, 0.25);
            font-size: 12px;
            font-weight: 400;
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
            padding: var(--uui-size-space-4) 0;
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
            margin: var(--uui-size-layout-1) 0 var(--uui-size-space-5);
            font-size: var(--uui-type-small-size, 11px);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--uui-color-text-alt, #6b7280);
            padding-bottom: var(--uui-size-space-3);
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .section-heading-count {
            font-weight: 400;
            text-transform: none;
            letter-spacing: 0;
            opacity: 0.7;
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
u([
  g()
], c.prototype, "_loading", 2);
u([
  g()
], c.prototype, "_result", 2);
u([
  g()
], c.prototype, "_error", 2);
u([
  g()
], c.prototype, "_activeFilter", 2);
u([
  g()
], c.prototype, "_collapsedBlocks", 2);
c = u([
  x("schema-preview-workspace-view")
], c);
const P = c;
export {
  c as SchemaPreviewWorkspaceView,
  P as default
};
//# sourceMappingURL=workspace-view.element-C22K5cJ2.js.map
