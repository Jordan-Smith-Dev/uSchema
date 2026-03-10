export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "uSchema Dashboard",
    alias: "Umbraco.Community.SchemaPreview.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    meta: {
      label: "uSchema",
      pathname: "uschema",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
    ],
  },
];
