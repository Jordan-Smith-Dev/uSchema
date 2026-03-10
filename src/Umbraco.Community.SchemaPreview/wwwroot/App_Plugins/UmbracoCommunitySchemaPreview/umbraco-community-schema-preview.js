const a = [
  {
    name: "Umbraco Community Schema Preview Entrypoint",
    alias: "Umbraco.Community.SchemaPreview.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-1dwyYRGg.js")
  }
], e = [
  {
    name: "uSchema Dashboard",
    alias: "Umbraco.Community.SchemaPreview.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-C2oTilM4.js"),
    meta: {
      label: "uSchema",
      pathname: "uschema"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], t = [
  {
    name: "uSchema Workspace View",
    alias: "Umbraco.Community.SchemaPreview.WorkspaceView",
    type: "workspaceView",
    js: () => import("./workspace-view.element-C22K5cJ2.js"),
    weight: 90,
    meta: {
      label: "uSchema",
      pathname: "uschema",
      icon: "icon-settings-alt"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document"
      }
    ]
  }
], i = [
  ...a,
  ...e,
  ...t
];
export {
  i as manifests
};
//# sourceMappingURL=umbraco-community-schema-preview.js.map
