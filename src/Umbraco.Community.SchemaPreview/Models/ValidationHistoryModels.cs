namespace Umbraco.Community.SchemaPreview.Models
{
    /// <summary>Lightweight summary returned when listing history — no full result payload.</summary>
    public class ValidationHistorySummary
    {
        public int Index { get; set; }
        public DateTime ScannedAt { get; set; }
        public int ValidBlocks { get; set; }
        public int WarningBlocks { get; set; }
        public int InvalidBlocks { get; set; }
        public int TotalBlocks { get; set; }
        public bool HasResult { get; set; }
    }

    public class ValidationHistoryEntry
    {
        public DateTime ScannedAt { get; set; }
        public int ValidBlocks { get; set; }
        public int WarningBlocks { get; set; }
        public int InvalidBlocks { get; set; }
        public int TotalBlocks { get; set; }

        /// <summary>Full validation result snapshot — stored for historical report viewing.</summary>
        public object? Result { get; set; }
    }
}
