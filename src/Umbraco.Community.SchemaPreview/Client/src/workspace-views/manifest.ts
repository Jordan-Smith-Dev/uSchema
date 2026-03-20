export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "uSchema Workspace View",
    alias: "Umbraco.Community.SchemaPreview.WorkspaceView",
    type: "workspaceView",
    js: () => import("./workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "uSchema",
      pathname: "uschema",
      icon: "icon-search",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document",
      },
    ],
  },
];
