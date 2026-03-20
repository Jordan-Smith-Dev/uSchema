using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Umbraco.Community.SchemaPreview.Models;

namespace Umbraco.Community.SchemaPreview.Services
{
    public class ValidationHistoryService
    {
        private const int MaxEntriesPerKey = 50;
        private static readonly TimeSpan MaxAge = TimeSpan.FromDays(365);
        private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

        private readonly ILogger<ValidationHistoryService> _logger;
        private readonly string _historyFilePath;
        private readonly ConcurrentDictionary<Guid, List<ValidationHistoryEntry>> _history = new();
        private readonly SemaphoreSlim _saveLock = new(1, 1);
        private bool _loaded;

        public ValidationHistoryService(IWebHostEnvironment env, ILogger<ValidationHistoryService> logger)
        {
            _logger = logger;
            var dir = Path.Combine(env.ContentRootPath, "App_Data", "uSchema");
            Directory.CreateDirectory(dir);
            _historyFilePath = Path.Combine(dir, "validation-history.json");
        }

        public void Record(Guid contentKey, object result, int valid, int warnings, int invalid)
        {
            EnsureLoaded();
            var entry = new ValidationHistoryEntry
            {
                ScannedAt     = DateTime.UtcNow,
                ValidBlocks   = valid,
                WarningBlocks = warnings,
                InvalidBlocks = invalid,
                TotalBlocks   = valid + warnings + invalid,
                Result        = result,
            };

            _history.AddOrUpdate(
                contentKey,
                _ => [entry],
                (_, existing) =>
                {
                    existing.Insert(0, entry);
                    if (existing.Count > MaxEntriesPerKey)
                        existing.RemoveRange(MaxEntriesPerKey, existing.Count - MaxEntriesPerKey);
                    return existing;
                });

            _ = SaveAsync();
        }

        public IReadOnlyList<ValidationHistoryEntry> GetHistory(Guid contentKey)
        {
            EnsureLoaded();
            return _history.TryGetValue(contentKey, out var list)
                ? list.AsReadOnly()
                : [];
        }

        public ValidationHistoryEntry? GetEntry(Guid contentKey, int index)
        {
            EnsureLoaded();
            if (!_history.TryGetValue(contentKey, out var list)) return null;
            return index >= 0 && index < list.Count ? list[index] : null;
        }

        public bool DeleteEntry(Guid contentKey, int index)
        {
            EnsureLoaded();
            if (!_history.TryGetValue(contentKey, out var list)) return false;
            if (index < 0 || index >= list.Count) return false;
            list.RemoveAt(index);
            _ = SaveAsync();
            return true;
        }

        public void ClearHistory(Guid contentKey)
        {
            EnsureLoaded();
            _history.TryRemove(contentKey, out _);
            _ = SaveAsync();
        }

        private void EnsureLoaded()
        {
            if (_loaded) return;
            _loaded = true;
            try
            {
                if (!File.Exists(_historyFilePath)) return;
                var json = File.ReadAllText(_historyFilePath);
                var dict = JsonSerializer.Deserialize<Dictionary<Guid, List<ValidationHistoryEntry>>>(json, JsonOptions);
                if (dict is null) return;
                var cutoff = DateTime.UtcNow - MaxAge;
                foreach (var (key, value) in dict)
                {
                    var fresh = value.Where(e => e.ScannedAt >= cutoff).ToList();
                    if (fresh.Count > 0) _history[key] = fresh;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uSchema: could not load validation history from {Path}", _historyFilePath);
            }
        }

        private async Task SaveAsync()
        {
            await _saveLock.WaitAsync();
            try
            {
                var dict = new Dictionary<Guid, List<ValidationHistoryEntry>>(_history);
                var json = JsonSerializer.Serialize(dict, JsonOptions);
                await File.WriteAllTextAsync(_historyFilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uSchema: could not save validation history to {Path}", _historyFilePath);
            }
            finally
            {
                _saveLock.Release();
            }
        }
    }
}
