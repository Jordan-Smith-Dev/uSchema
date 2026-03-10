export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "uSchema Entrypoint",
    alias: "Umbraco.Community.SchemaPreview.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
