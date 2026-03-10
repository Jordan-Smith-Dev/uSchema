@ECHO OFF
:: This file can now be deleted!
:: It was used when setting up the package solution (using https://github.com/LottePitcher/opinionated-package-starter)

:: set up git
git init
git branch -M main
git remote add origin https://github.com/JordanSmith/YourGitHubRepoName.git

:: ensure latest Umbraco templates used
dotnet new install Umbraco.Templates --force

:: use the umbraco-extension dotnet template to add the package project
cd src
dotnet new umbraco-extension -n "Umbraco.Community.SchemaPreview" --site-domain "https://localhost:44345" --include-example

:: replace package .csproj with the one from the template so has nuget info
cd Umbraco.Community.SchemaPreview
del Umbraco.Community.SchemaPreview.csproj
ren Umbraco.Community.SchemaPreview_nuget.csproj Umbraco.Community.SchemaPreview.csproj

:: add project to solution
cd..
dotnet sln add "Umbraco.Community.SchemaPreview"

:: add reference to project from test site
dotnet add "Umbraco.Community.SchemaPreview.TestSite/Umbraco.Community.SchemaPreview.TestSite.csproj" reference "Umbraco.Community.SchemaPreview/Umbraco.Community.SchemaPreview.csproj"
