import {
    LitElement,
    css,
    html,
    customElement,
    state
} from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/document';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';

type SchemaBlock = {
    index: number;
    type: string;
    raw: string;
    errors: string[];
    warnings: string[];
    location?: 'head' | 'body';
};

type ValidationResult = {
    url?: string;
    published: boolean;
    documentType?: string;
    hasTemplate?: boolean;
    blocks: SchemaBlock[];
    summary: {
        valid: number;
        invalid: number;
        warnings: number;
        none: boolean;
    };
    fetchError?: string;
};

type FilterState = 'valid' | 'warning' | 'invalid' | null;

type EnrichedMessage = {
    title: unknown;
    detail: unknown;
    propertyName?: string;
    example?: string;
    docsUrl?: string;
};

function enrichMessage(raw: string): EnrichedMessage {
    if (raw === 'Missing @context') {
        return {
            title: html`
                Missing
                <code class="prop-name">@context</code>
            `,
            detail: 'Every JSON-LD block must declare a context so search engines know how to interpret the properties.',
            example: '"@context": "https://schema.org"',
            docsUrl: 'https://schema.org/docs/gs1.html'
        };
    }

    if (raw === 'Missing @type') {
        return {
            title: html`
                Missing
                <code class="prop-name">@type</code>
            `,
            detail: html`
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
            docsUrl: 'https://schema.org/docs/gs1.html'
        };
    }

    if (raw.startsWith('JSON parse error:')) {
        return {
            title: 'Invalid JSON — block cannot be parsed',
            detail: `This block contains malformed JSON. Fix the syntax error and re-validate. Parser said: ${raw.replace('JSON parse error: ', '')}`,
            docsUrl: 'https://jsonlint.com'
        };
    }

    const known: Record<string, EnrichedMessage> = {
        'Recommended: headline': {
            title: 'is recommended',
            propertyName: 'headline',
            detail: 'A concise title for the article (max 110 characters). Required by Google to be eligible for Article rich results in Search.',
            example: '"headline": "5 Ways to Improve Your SEO in 2024"',
            docsUrl:
                'https://developers.google.com/search/docs/appearance/structured-data/article'
        },
        'Recommended: datePublished': {
            title: 'is recommended',
            propertyName: 'datePublished',
            detail: 'The date the content was first published, in ISO 8601 format. Helps search engines surface timely and recently updated content.',
            example: '"datePublished": "2024-01-15T09:00:00+00:00"',
            docsUrl: 'https://schema.org/datePublished'
        },
        'Recommended: author': {
            title: 'is recommended',
            propertyName: 'author',
            detail: 'Identifies who created the content. Strengthens E-E-A-T (Experience, Expertise, Authority, Trust) signals that Google uses when ranking content.',
            example:
                '"author": { "@type": "Person", "name": "Jane Doe", "url": "https://example.com/team/jane" }',
            docsUrl: 'https://schema.org/author'
        },
        'Recommended: image': {
            title: 'is recommended',
            propertyName: 'image',
            detail: 'A representative image for the article. Google requires at least one image to show Article rich results — without it the block may be ignored.',
            example: '"image": "https://example.com/images/article-cover.jpg"',
            docsUrl:
                'https://developers.google.com/search/docs/appearance/structured-data/article#article-properties'
        },
        'Recommended: name': {
            title: 'is recommended',
            propertyName: 'name',
            detail: 'The name or title of this entity. Required for most rich result types and used by search engines to label the entity in knowledge panels.',
            example: '"name": "Acme Corporation"',
            docsUrl: 'https://schema.org/name'
        },
        'Recommended: url': {
            title: 'is recommended',
            propertyName: 'url',
            detail: 'The canonical URL of this entity or page. Helps search engines identify the definitive location and avoid treating it as a duplicate.',
            example: '"url": "https://www.example.com"',
            docsUrl: 'https://schema.org/url'
        },
        'Recommended: logo': {
            title: 'is recommended',
            propertyName: 'logo',
            detail: "The organisation's logo image. Used by Google for Knowledge Panels, Sitelinks, and other rich results. Prefer a wide, rectangular image.",
            example:
                '"logo": { "@type": "ImageObject", "url": "https://example.com/logo.png", "width": 200, "height": 60 }',
            docsUrl:
                'https://developers.google.com/search/docs/appearance/structured-data/organization#logo'
        },
        'Recommended: itemListElement': {
            title: html`
                is required for
                <code class="prop-name">BreadcrumbList</code>
            `,
            propertyName: 'itemListElement',
            detail: html`
                An ordered array of
                <code class="prop-name">ListItem</code>
                entries that make up the breadcrumb trail. Without this the
                <code class="prop-name">BreadcrumbList</code>
                block is empty and search engines will ignore it.
            `,
            example:
                '"itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" }]',
            docsUrl:
                'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb'
        },
        'Recommended: mainEntity': {
            title: html`
                is required for
                <code class="prop-name">FAQPage</code>
            `,
            propertyName: 'mainEntity',
            detail: html`
                An array of
                <code class="prop-name">Question</code>
                entities. Without this an
                <code class="prop-name">FAQPage</code>
                block has no questions to display and will not generate FAQ rich
                results in Search.
            `,
            example:
                '"mainEntity": [{ "@type": "Question", "name": "What is schema.org?", "acceptedAnswer": { "@type": "Answer", "text": "A vocabulary for structured data on the web." } }]',
            docsUrl:
                'https://developers.google.com/search/docs/appearance/structured-data/faqpage'
        }
    };

    return known[raw] ?? { title: raw, detail: '' };
}

const API_BASE = '/umbraco/umbracocommunityschemapreview/api/v1';

const svgRotateCw = html`
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
`;

const svgExternalLink = html`
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
`;

const svgChevron = (up: boolean) => html`
    <svg
        class="btn-icon${up ? ' btn-icon--up' : ''}"
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

@customElement('schema-preview-workspace-view')
export class SchemaPreviewWorkspaceView extends UmbElementMixin(LitElement) {
    @state() private _loading = true;
    @state() private _result: ValidationResult | null = null;
    @state() private _error: string | null = null;
    @state() private _activeFilter: FilterState = null;
    @state() private _collapsedBlocks = new Set<number>();

    private _unique: string | null = null;
    private _tokenProvider?: () => string | Promise<string>;
    private _notificationContext?: {
        peek(
            color: 'positive' | 'warning' | 'danger',
            options: { data: { headline: string; message: string } }
        ): void;
    };

    override connectedCallback() {
        super.connectedCallback();

        this.consumeContext(UMB_AUTH_CONTEXT, (authContext) => {
            this._tokenProvider = authContext?.getOpenApiConfiguration().token;
        });

        this.consumeContext(UMB_NOTIFICATION_CONTEXT, (ctx) => {
            this._notificationContext = ctx;
        });

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, async (ctx) => {
            const unique = ctx?.getUnique?.();
            if (!unique) {
                this._error = 'Could not determine content key from workspace.';
                this._loading = false;
                return;
            }
            this._unique = unique;
            await this._validate(unique);
        });
    }

    private async _validate(unique: string) {
        this._loading = true;
        this._error = null;
        this._result = null;
        this._activeFilter = null;
        this._collapsedBlocks = new Set();

        try {
            const token = this._tokenProvider
                ? await this._tokenProvider()
                : undefined;
            const res = await fetch(`${API_BASE}/validate/key/${unique}`, {
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });

            if (!res.ok) {
                throw new Error(
                    `Validation request failed: ${res.status} ${res.statusText}`
                );
            }

            this._result = await res.json();
            if (this._result) this._notifyResult(this._result);
        } catch (e: unknown) {
            this._error =
                e instanceof Error
                    ? e.message
                    : 'An unexpected error occurred.';
        } finally {
            this._loading = false;
        }
    }

    private _notifyResult(result: ValidationResult) {
        if (
            !this._notificationContext ||
            result.fetchError ||
            !result.published
        )
            return;
        const s = result.summary;
        if (s.none) return;
        if (s.invalid > 0) {
            this._notificationContext.peek('danger', {
                data: {
                    headline: 'Schema errors detected',
                    message: `${s.invalid} block${s.invalid !== 1 ? 's have' : ' has'} errors that will prevent rich results.`
                }
            });
        } else if (s.warnings > 0) {
            this._notificationContext.peek('warning', {
                data: {
                    headline: 'Schema recommendations',
                    message: `${s.warnings} block${s.warnings !== 1 ? 's have' : ' has'} missing properties that could improve rich result eligibility.`
                }
            });
        } else {
            this._notificationContext.peek('positive', {
                data: {
                    headline: 'Schema looks good',
                    message: `All ${s.valid} block${s.valid !== 1 ? 's' : ''} passed validation.`
                }
            });
        }
    }

    private _blockStatus(b: SchemaBlock): 'valid' | 'warning' | 'invalid' {
        if (b.errors.length > 0) return 'invalid';
        if (b.warnings.length > 0) return 'warning';
        return 'valid';
    }

    private _toggleFilter(filter: 'valid' | 'warning' | 'invalid') {
        this._activeFilter = this._activeFilter === filter ? null : filter;
    }

    private _filteredBlocks(): SchemaBlock[] {
        if (!this._result) return [];
        if (!this._activeFilter) return this._result.blocks;
        return this._result.blocks.filter(
            (b) => this._blockStatus(b) === this._activeFilter
        );
    }

    private async _revalidate() {
        if (!this._unique || this._loading) return;
        await this._validate(this._unique);
    }

    private _toggleCollapse(index: number) {
        const next = new Set(this._collapsedBlocks);
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        this._collapsedBlocks = next;
    }

    private _toggleAll() {
        if (!this._result) return;
        const allCollapsed = this._result.blocks.every((b) =>
            this._collapsedBlocks.has(b.index)
        );
        const next = new Set(this._collapsedBlocks);
        for (const b of this._result.blocks) {
            if (allCollapsed) {
                next.delete(b.index);
            } else {
                next.add(b.index);
            }
        }
        this._collapsedBlocks = next;
    }

    private _allCollapsed(): boolean {
        if (!this._result || this._result.blocks.length === 0) return false;
        return this._result.blocks.every((b) =>
            this._collapsedBlocks.has(b.index)
        );
    }

    private _getDuplicateTypes(): string[] {
        if (!this._result) return [];
        const counts: Record<string, number> = {};
        for (const b of this._result.blocks) {
            if (b.type && b.type !== 'Unknown' && b.type !== 'Invalid JSON') {
                counts[b.type] = (counts[b.type] ?? 0) + 1;
            }
        }
        return Object.entries(counts)
            .filter(([, count]) => count > 1)
            .map(([type]) => type);
    }

    private _renderSummary() {
        if (!this._result) return null;
        const s = this._result.summary;
        const f = this._activeFilter;

        const tagClass = (filter: 'valid' | 'warning' | 'invalid') => {
            if (f === null) return 'filter-tag';
            if (f === filter) return 'filter-tag filter-tag--active';
            return 'filter-tag filter-tag--dimmed';
        };

        return html`
            <div class="summary-row">
                <div class="summary-filters">
                    <uui-tag
                        color="positive"
                        class=${tagClass('valid')}
                        @click=${() => this._toggleFilter('valid')}
                        title="Click to filter by valid blocks"
                    >
                        Valid: ${s.valid}
                    </uui-tag>

                    <uui-tag
                        color="warning"
                        class=${tagClass('warning')}
                        @click=${() => this._toggleFilter('warning')}
                        title="Click to filter by warning blocks"
                    >
                        Warnings: ${s.warnings}
                    </uui-tag>

                    <uui-tag
                        color="danger"
                        class=${tagClass('invalid')}
                        @click=${() => this._toggleFilter('invalid')}
                        title="Click to filter by invalid blocks"
                    >
                        Invalid: ${s.invalid}
                    </uui-tag>
                </div>

                <div class="summary-actions">
                    <uui-button
                        look="primary"
                        compact
                        @click=${this._toggleAll}
                        title=${this._allCollapsed()
                            ? 'Expand all blocks'
                            : 'Collapse all blocks'}
                    >
                        <span class="btn-content">
                            ${this._allCollapsed()
                                ? 'Expand all'
                                : 'Collapse all'}
                            ${svgChevron(this._allCollapsed())}
                        </span>
                    </uui-button>
                    ${this._result.url
                        ? html`
                              <uui-button
                                  look="primary"
                                  href=${'https://search.google.com/test/rich-results?url=' +
                                  encodeURIComponent(this._result.url)}
                                  target="_blank"
                                  label="Rich Results Test"
                                  title="Check which Google rich result features this page qualifies for (opens in a new tab)"
                              >
                                  <span class="btn-content">
                                      Rich Results Test ${svgExternalLink}
                                  </span>
                              </uui-button>
                              <uui-button
                                  look="primary"
                                  href=${'https://validator.schema.org/#url=' +
                                  encodeURIComponent(this._result.url)}
                                  target="_blank"
                                  label="Validate on schema.org"
                                  title="Open this page in Google's Schema Markup Validator (opens in a new tab)"
                              >
                                  <span class="btn-content">
                                      Validate on schema.org ${svgExternalLink}
                                  </span>
                              </uui-button>
                          `
                        : null}
                </div>
            </div>

            ${f
                ? html`
                      <p class="filter-hint">
                          Showing ${f} blocks only &mdash; click the tag again
                          to clear.
                      </p>
                  `
                : null}
        `;
    }

    private _renderMessage(
        raw: string,
        index: number,
        kind: 'error' | 'warning'
    ) {
        const msg = enrichMessage(raw);
        const titleNode = msg.propertyName
            ? html`
                  <code class="prop-name">"${msg.propertyName}"</code>
                  ${msg.title}
              `
            : msg.title;

        return html`
            <li class="msg-item">
                <div class="msg-header">
                    <span class="msg-index">${index}.</span>
                    <span class="msg-kind msg-kind--${kind}">
                        ${kind === 'error' ? 'Error' : 'Warning'}
                    </span>
                    <strong class="msg-title">${titleNode}</strong>
                    ${msg.docsUrl
                        ? html`
                              <uui-button
                                  look="primary"
                                  href=${msg.docsUrl}
                                  class="msg-button"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  label="Learn more"
                                  title="Navigate to this page for more information about this issue (opens in a new tab)"
                                  compact
                              >
                                  <span class="btn-content">
                                      Learn more ${svgExternalLink}
                                  </span>
                              </uui-button>
                          `
                        : null}
                </div>
                ${msg.detail
                    ? html`
                          <p class="msg-detail">${msg.detail}</p>
                      `
                    : null}
                ${msg.example
                    ? html`
                          <pre class="msg-example">${msg.example}</pre>
                      `
                    : null}
            </li>
        `;
    }

    private _exampleValue(prop: string): string {
        const map: Record<string, string> = {
            '@context': '"https://schema.org"',
            '@type': '"Article"',
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
        };
        return map[prop] ?? '"…"';
    }

    private _buildAnnotations(
        b: SchemaBlock
    ): Array<{ prop: string; kind: 'error' | 'warning' }> {
        const items: Array<{ prop: string; kind: 'error' | 'warning' }> = [];
        for (const e of b.errors) {
            if (e === 'Missing @context')
                items.push({ prop: '@context', kind: 'error' });
            else if (e === 'Missing @type')
                items.push({ prop: '@type', kind: 'error' });
        }
        for (const w of b.warnings) {
            const m = w.match(/^Recommended: (\S+)$/);
            if (m) items.push({ prop: m[1], kind: 'warning' });
        }
        return items;
    }

    private _renderJsonBlock(b: SchemaBlock) {
        return html`
            <umb-code-block language="JSON">${b.raw}</umb-code-block>
        `;
    }

    private _renderExamplesBlock(b: SchemaBlock) {
        const annotations = this._buildAnnotations(b);
        if (annotations.length === 0) return null;

        const lines = b.raw.split('\n');

        // Find insertion point — before the last closing brace
        let insertIdx = lines.length - 1;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() === '}') {
                insertIdx = i;
                break;
            }
        }

        // Detect indentation from the first property line
        const firstProp = lines.find((l) => l.trim().startsWith('"'));
        const indent = firstProp?.match(/^(\s+)/)?.[1] ?? '  ';

        // prettier-ignore
        const renderLine = (line: string) => html`<span class="jv-line">${line + '\n'}</span>`;

        // prettier-ignore
        const renderGhost = ({ prop, kind }: { prop: string; kind: 'error' | 'warning' }) =>
            html`<span class="jv-line jv-line--ghost jv-line--${kind}">${indent}<span class="jv-ghost-pill">${kind === 'error' ? '✗ missing' : '+ add'}</span> &quot;${prop}&quot;: ${this._exampleValue(prop)}${'\n'}</span>`;

        return html`
            <div class="json-viewer">
                <div class="json-viewer__header">json examples</div>
                <pre class="json-viewer__pre"><code>${[
                    ...lines.slice(0, insertIdx).map(renderLine),
                    ...annotations.map(renderGhost),
                    ...lines.slice(insertIdx).map(renderLine)
                ]}</code></pre>
            </div>
        `;
    }

    private _renderSourceMeta(b: SchemaBlock) {
        const locationPill = b.location
            ? html`<span class="source-location source-location--${b.location}">&lt;${b.location}&gt;</span>`
            : null;

        const locationNote =
            b.location === 'head'
                ? html`<span class="source-note source-note--positive">Correctly placed — Google recommends JSON-LD in <code>&lt;head&gt;</code> for fastest discovery.</span>`
                : b.location === 'body'
                  ? html`<span class="source-note source-note--warning">Found in <code>&lt;body&gt;</code> — consider moving to <code>&lt;head&gt;</code> for better search engine compatibility.</span>`
                  : null;

        if (this._result?.hasTemplate && this._result?.documentType) {
            return html`
                <div class="source-meta">
                    <div class="source-meta__row">
                        ${locationPill}${locationNote}
                    </div>
                    <div class="source-meta__row">
                        <span class="source-note">Template: <strong>${this._result.documentType}</strong> — look for <code>Views/${this._result.documentType}.cshtml</code> or a partial view used by that template.</span>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="source-meta source-meta--unknown">
                ${locationPill || locationNote
                    ? html`<div class="source-meta__row">${locationPill}${locationNote}</div>`
                    : null}
                <div class="source-meta__row">
                    <span class="source-note source-note--muted">Source unknown — this block may be injected by an external tool, plugin, or script tag not tied to a Razor template.</span>
                </div>
            </div>
        `;
    }

    private _renderBlock(b: SchemaBlock) {
        const status = this._blockStatus(b);
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        const invalidTypes = ['Unknown', 'Invalid JSON'];
        const typeDocsUrl = !invalidTypes.includes(b.type)
            ? `https://schema.org/${b.type}`
            : null;
        const isCollapsed = this._collapsedBlocks.has(b.index);

        return html`
            <uui-box
                class="block-box block-box--${status}${isCollapsed
                    ? ' block-box--collapsed'
                    : ''}"
            >
                <div slot="headline" class="block-headline">
                    <span
                        class="block-status-badge block-status-badge--${status}"
                    >
                        ${statusLabel}
                    </span>
                    Block ${b.index}: ${b.type}
                </div>

                ${typeDocsUrl
                    ? html`
                          <uui-button
                              slot="header-actions"
                              look="outline"
                              href=${typeDocsUrl}
                              target="_blank"
                              label=${'schema.org/' + b.type}
                              title=${'View schema.org documentation for ' +
                              b.type +
                              ' (opens in a new tab)'}
                              compact
                          >
                              <span class="btn-content">
                                  schema.org ${svgExternalLink}
                              </span>
                          </uui-button>
                          <span
                              slot="header-actions"
                              class="header-btn-sep"
                          ></span>
                      `
                    : null}

                <uui-button
                    slot="header-actions"
                    look="outline"
                    compact
                    @click=${() => this._toggleCollapse(b.index)}
                    title=${isCollapsed
                        ? 'Expand this block'
                        : 'Collapse this block'}
                >
                    <span class="btn-content">
                        ${isCollapsed ? 'Expand' : 'Collapse'}
                        ${svgChevron(!isCollapsed)}
                    </span>
                </uui-button>

                ${isCollapsed
                    ? null
                    : html`
                          ${this._renderSourceMeta(b)}
                          ${this._renderJsonBlock(b)}
                          ${b.errors.length
                              ? html`
                                    <uui-alert color="danger" headline="Errors">
                                        <p
                                            class="alert-subtitle alert-subtitle--danger"
                                        >
                                            The following issues prevent this
                                            block from being recognised as valid
                                            structured data by search engines.
                                        </p>
                                        <ul class="msg-list">
                                            ${b.errors.map((e, i) =>
                                                this._renderMessage(
                                                    e,
                                                    i + 1,
                                                    'error'
                                                )
                                            )}
                                        </ul>
                                    </uui-alert>
                                `
                              : null}
                          ${b.warnings.length
                              ? html`
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
                                            ${b.warnings.map((w, i) =>
                                                this._renderMessage(
                                                    w,
                                                    i + 1,
                                                    'warning'
                                                )
                                            )}
                                        </ul>
                                    </uui-alert>
                                `
                              : null}
                          ${this._renderExamplesBlock(b)}
                      `}
            </uui-box>
        `;
    }

    private _renderFetchErrorAlert() {
        const error = this._result!.fetchError!;
        const url = this._result!.url;
        const is404 = error.includes('404');
        return html`
            <uui-alert color="warning" headline="Could not fetch page">
                <p class="state-msg">${error}</p>
                ${url
                    ? html`
                          <div class="fetch-url-box">
                              <span class="fetch-url-label">URL attempted</span>
                              <code class="fetch-url-code">${url}</code>
                          </div>
                      `
                    : null}
                ${is404
                    ? html`
                          <div class="fetch-hint-box">
                              <strong>Tip:</strong> Check
                              <strong>Content &rsaquo; Culture &amp; Hostnames</strong>
                              for this node and ensure a valid hostname is assigned. In
                              local development, uSchema rewrites the URL to match the
                              running server — if you still see a 404, confirm the page
                              has a template assigned and is accessible at the URL above.
                          </div>
                      `
                    : null}
            </uui-alert>
        `;
    }

    override render() {
        if (this._loading) {
            return html`
                <div class="loader"><uui-loader></uui-loader></div>
            `;
        }

        if (this._error) {
            return html`
                <uui-alert color="danger">${this._error}</uui-alert>
            `;
        }

        if (!this._result) {
            return html`
                <uui-alert>No result.</uui-alert>
            `;
        }

        const isReady = this._result.published && !this._result.fetchError;
        const filtered = isReady ? this._filteredBlocks() : [];
        const duplicates = isReady ? this._getDuplicateTypes() : [];
        const { summary: s } = this._result;
        const total = isReady ? s.valid + s.invalid + s.warnings : 0;

        return html`
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
                    ${isReady && this._result.url
                        ? html`
                              <uui-button
                                  look="outline"
                                  href=${this._result.url}
                                  target="_blank"
                                  title="Open the published page in a new tab"
                              >
                                  <span class="btn-content"
                                      >View page ${svgExternalLink}</span
                                  >
                              </uui-button>
                          `
                        : null}
                    <uui-button
                        look="primary"
                        color="positive"
                        @click=${this._revalidate}
                        ?disabled=${this._loading}
                        title="Re-run validation against the current published page"
                    >
                        <span class="btn-content"
                            >Re-validate ${svgRotateCw}</span
                        >
                    </uui-button>
                </div>
            </div>

            ${this._result.fetchError ? this._renderFetchErrorAlert() : null}

            ${!this._result.published
                ? html`
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
                  `
                : null}

            ${isReady
                ? html`
                      ${this._renderSummary()}

                      <h4 class="section-heading">
                          Page schema data duplication
                          <span class="section-heading-count">
                              (
                              <strong>${duplicates.length}</strong>
                              duplicate schema
                              type${duplicates.length !== 1 ? 's' : ''} found)
                          </span>
                      </h4>

                      ${duplicates.length > 0
                          ? html`
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
                                        ${duplicates.map(
                                            (t) =>
                                                html`<li>
                                                    <code class="prop-name"
                                                        >${t}</code
                                                    >
                                                </li>`
                                        )}
                                    </ul>
                                </uui-box>
                            `
                          : null}

                      <h4 class="section-heading">
                          Page schema data analysis
                          <span class="section-heading-count">
                              (
                              <strong>${total}</strong>
                              schema block${total !== 1 ? 's' : ''} detected on
                              this page)
                          </span>
                      </h4>

                      ${this._result.summary.none
                          ? html`
                                <uui-alert>
                                    No
                                    <code>application/ld+json</code>
                                    script blocks found on this page.
                                </uui-alert>
                            `
                          : null}
                      ${filtered.length === 0 && this._activeFilter
                          ? html`
                                <uui-alert>
                                    No ${this._activeFilter} blocks on this
                                    page.
                                </uui-alert>
                            `
                          : filtered.map((b) => this._renderBlock(b))}
                  `
                : null}
        `;
    }

    static override styles = css`
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
}

export default SchemaPreviewWorkspaceView;

declare global {
    interface HTMLElementTagNameMap {
        'schema-preview-workspace-view': SchemaPreviewWorkspaceView;
    }
}
