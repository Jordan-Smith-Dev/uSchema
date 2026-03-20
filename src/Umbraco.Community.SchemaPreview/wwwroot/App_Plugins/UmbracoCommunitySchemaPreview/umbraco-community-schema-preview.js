const a = [
  {
    name: "uSchema Entrypoint",
    alias: "Umbraco.Community.SchemaPreview.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-1dwyYRGg.js")
  }
], e = [
  {
    name: "uSchema Dashboard",
    alias: "Umbraco.Community.SchemaPreview.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-Cg5T1gJD.js"),
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
], i = [
  {
    name: "uSchema Workspace View",
    alias: "Umbraco.Community.SchemaPreview.WorkspaceView",
    type: "workspaceView",
    js: () => import("./workspace-view.element-CoKGcpq7.js"),
    weight: 90,
    meta: {
      label: "uSchema",
      pathname: "uschema",
      icon: "icon-search"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document"
      }
    ]
  }
], m = [
  ...a,
  ...e,
  ...i
];
export {
  m as manifests
};
//# sourceMappingURL=umbraco-community-schema-preview.js.map
