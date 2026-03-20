namespace Umbraco.Community.SchemaPreview
{
    /// <summary>
    /// Optional configuration for uSchema, read from the "uSchema" section of appsettings.json.
    /// </summary>
    public class USchemaOptions
    {
        /// <summary>
        /// Maps Umbraco document type aliases to recommended schema.org types.
        /// When a page has no JSON-LD blocks, uSchema uses this map to suggest an appropriate schema type.
        /// </summary>
        /// <example>
        /// "uSchema": {
        ///   "DocumentTypeSchemaMap": {
        ///     "blogPost": "Article",
        ///     "product": "Product",
        ///     "landingPage": "WebPage",
        ///     "event": "Event"
        ///   }
        /// }
        /// </example>
        public Dictionary<string, string> DocumentTypeSchemaMap { get; set; }
            = new(StringComparer.OrdinalIgnoreCase);
    }
}
