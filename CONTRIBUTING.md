# Contributing to Umbraco Community uSchema

Thanks for your interest in contributing. Below is everything you need to get the project running locally.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- A browser (for the Umbraco backoffice)

## Repository layout

```
src/
  Umbraco.Community.SchemaPreview/          # The NuGet package project
    Client/                                 # Lit/Vite frontend
      src/
        dashboards/dashboard.element.ts
        workspace-views/workspace-view.element.ts
        entrypoints/
    Controllers/                            # ASP.NET Core Management API
    Composers/
    wwwroot/App_Plugins/                    # Built frontend output (committed)
  Umbraco.Community.SchemaPreview.TestSite/ # Local Umbraco site for testing
docs/
  README_nuget.md                           # README that ships inside the NuGet package
  images/                                   # Screenshots for README / NuGet listing
```

## Running locally

### 1. Build the frontend

```bash
cd src/Umbraco.Community.SchemaPreview/Client
npm ci
npm run build
```

The built output lands in `../wwwroot/App_Plugins/UmbracoCommunitySchemaPreview/`.

For live-reload during frontend development:

```bash
npm run dev
```

Vite will watch for changes and rebuild to wwwroot automatically.

### 2. Run the test site

```bash
cd src/Umbraco.Community.SchemaPreview.TestSite
dotnet run
```

The site starts at `https://localhost:44345` (HTTPS) / `http://localhost:44137` (HTTP).

On first run, Umbraco will install itself against the local SQLite database. Log in with:

- **Username:** `admin@example.com`
- **Password:** `1234567890`

### 3. Testing the package in the backoffice

1. Open any published content node and click the **Schema** tab
2. Or go to **Content > uSchema** for the dashboard

The dev site has a hostname configured at `https://localhost:44345/testing/`. The controller rewrites this to the current request host automatically in development, so self-calls work without any extra configuration.

## Making changes

### Backend (C#)

Edit files under `Controllers/` or `Composers/`, then restart the test site with `dotnet run`.

### Frontend (TypeScript / Lit)

Edit files under `Client/src/`, then either:

- Run `npm run build` and refresh the browser, or
- Run `npm run dev` for automatic rebuilds

## Releasing

Releases are triggered by pushing a semver tag:

```bash
git tag 1.0.1
git push origin 1.0.1
```

The [release workflow](.github/workflows/release.yml) will:

1. Build the frontend (`npm ci && npm run build`)
2. Pack the NuGet package (`dotnet pack`)
3. Push to NuGet.org
4. Create a GitHub Release with auto-generated release notes

Make sure `NUGET_API_KEY` is set in the repository secrets before pushing a tag.

## Screenshots

Screenshots for the README and NuGet listing should be saved to `docs/images/`. Reference them from [README.md](README.md) using relative paths.

## Code style

- Backend: standard C# conventions, nullable enabled
- Frontend: TypeScript strict mode, Lit web components, no external state libraries
- Keep components self-contained — avoid shared state between the dashboard and workspace view

## Issues and pull requests

Please open an issue before starting significant work so we can discuss the approach. For small fixes, a PR is welcome directly.
