# Contributing Guidelines

Contributions to this package are most welcome!

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/) and npm
- A code editor (Visual Studio, VS Code, or Rider)

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/JordanSmith/Umbraco.Community.SchemaPreview.git
   cd Umbraco.Community.SchemaPreview
   ```

2. Build the frontend

   ```bash
   cd src/Umbraco.Community.SchemaPreview/Client
   npm install
   npm run build
   ```

3. Run the test site

   The solution includes a test Umbraco site pre-configured for local development.

   ```bash
   cd src/Umbraco.Community.SchemaPreview.TestSite
   dotnet run
   ```

   The test site performs an unattended install on first run. Check `appsettings.json` for the default admin login details.

4. For frontend development with hot-reload, run the watch script while the test site is running:

   ```bash
   cd src/Umbraco.Community.SchemaPreview/Client
   npm run watch
   ```

## Project Structure

```
src/
├── Umbraco.Community.SchemaPreview/          # The NuGet package
│   ├── Client/                               # Lit/TypeScript frontend (Vite)
│   │   └── src/
│   │       ├── workspace-views/              # Schema tab component
│   │       ├── dashboards/                   # Dashboard component
│   │       └── api/                          # Generated OpenAPI client
│   ├── Controllers/                          # Management API controllers
│   └── Composers/                            # DI composition root
└── Umbraco.Community.SchemaPreview.TestSite/ # Local test site
```

## Regenerating the API Client

If you modify the backend API, regenerate the TypeScript client from the running test site:

```bash
cd src/Umbraco.Community.SchemaPreview/Client
npm run generate-client
```

## Submitting Changes

1. Fork the repository
2. Create a branch from `main`
3. Make your changes, including tests where applicable
4. Open a pull request with a clear description of what you've changed and why
