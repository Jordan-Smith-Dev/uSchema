# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-20

### Added
- **Validation history** — the workspace tab now stores a per-page history of recent scans; the history table shows the date, time, and block summary for each entry; any previous result can be loaded in full; the most recent scan is highlighted as active on load
- **Schema type suggestions** — when a page has no JSON-LD markup, uSchema can suggest an appropriate schema type based on the Umbraco document type alias, and displays a ready-to-use example block to help get started; configured via `DocumentTypeSchemaMap` in `appsettings.json`
- **"Suggested fix" panel** — the annotated JSON block shown for blocks with errors or warnings is now headed with a title and description clarifying that it addresses all flagged issues in the block (not just the last listed item) and that example values should be reviewed before use
- **Google Rich Results eligibility** — each schema block now shows whether it meets Google's requirements for rich results, lists any missing required fields, and links directly to Google's Rich Results documentation for that type

### Changed
- Duplicate type detection section is now hidden when no duplicates are found, rather than showing a "0 duplicates" heading
- Source location template hint reworded as a suggestion ("may originate from...") rather than a definitive file path, to account for layouts and partial views
- Section headings in the workspace tab and dashboard now include icons and consistent styling
- JSON viewer blocks are now labelled with the schema type (e.g. "JSON — Article") for clarity
- Appsettings configuration tip redesigned: clearer copy explaining what keys and values represent, with a clean JSON example

### Fixed
- History row correctly highlights as active after the initial scan (index 0) without requiring a manual load

## [1.0.1] - 2026-03-10

### Fixed
- Dashboard content picker: `umb-input-document` returns a plain GUID string in Umbraco 17; the picker handler now correctly reads the full string rather than the first character
- Dashboard content picker: added UDI prefix stripping so picker values like `umb://document/{guid}` are handled gracefully
- Dev/localhost support: controller now rewrites the resolved page URL to match the current request host in development, so self-calls work even when a production hostname is configured in Culture & Hostnames
- Error display in workspace tab and dashboard now uses styled Umbraco UI components (`uui-alert`) instead of plain text
- Workspace tab: page header (logo, title, description, Re-validate button) is now shown in all result states including fetch errors and unpublished pages

## [1.0.0] - 2026-03-02

### Added
- Schema workspace tab on all content nodes — validates every `<script type="application/ld+json">` block found on the published page
- Per-block status badges: Valid, Warning, Invalid
- Summary filter row with clickable tags to filter blocks by status
- Detailed error and recommendation messages with schema.org / Google documentation links
- Annotated JSON examples view showing exactly which properties are missing, colour-coded by severity
- Duplicate schema type detection across blocks
- Collapse/expand individual blocks and collapse-all toggle
- "Rich Results Test" and "Validate on schema.org" quick-links
- Source location indicator per block (`<head>` vs `<body>`) with document type attribution
- Dashboard with content picker — validate any published page without navigating to it
- Google Rich Results coverage for 30+ schema types: Article, NewsArticle, BlogPosting, WebPage, WebSite, Organization, LocalBusiness, Person, BreadcrumbList, FAQPage, Product, Event, Recipe, VideoObject, HowTo, JobPosting, Review, AggregateRating, Book, Course, Dataset, Movie, SoftwareApplication, QAPage, ItemList, ClaimReview, and more
- `@graph`-based JSON-LD block support
