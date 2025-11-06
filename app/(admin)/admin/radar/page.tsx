"use client";

import { useState } from "react";

import { aiRadar, RadarConfig, RadarEntry, technologyRadar } from "@/lib/radar-data";

type RadarType = "technology" | "ai";

export default function RadarAdminPage() {
  const [selectedRadar, setSelectedRadar] = useState<RadarType>("technology");
  const [entries, setEntries] = useState<RadarEntry[]>(technologyRadar.entries);
  const [editingEntry, setEditingEntry] = useState<RadarEntry | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Get current radar config
  const currentConfig = selectedRadar === "technology" ? technologyRadar : aiRadar;

  // Handle radar switch
  const handleRadarSwitch = (type: RadarType) => {
    setSelectedRadar(type);
    setEntries(type === "technology" ? technologyRadar.entries : aiRadar.entries);
    setEditingEntry(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = (entry: RadarEntry) => {
    if (editingEntry) {
      // Update existing entry
      setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));
    } else {
      // Add new entry
      setEntries([...entries, entry]);
    }
    setEditingEntry(null);
    setShowForm(false);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  // Generate TypeScript export
  const generateExport = () => {
    const radarData = selectedRadar === "technology" ? { ...technologyRadar } : { ...aiRadar };
    radarData.entries = entries;

    const tsCode = `// Auto-generated radar data for ${selectedRadar} radar
export const ${selectedRadar}Radar: RadarConfig = ${JSON.stringify(radarData, null, 2)};`;

    return tsCode;
  };

  // Copy to clipboard
  const handleExport = () => {
    const code = generateExport();
    navigator.clipboard.writeText(code);
    alert("Radar data copied to clipboard! Paste it into lib/radar-data.ts");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Radar Management</h1>
          <p className="text-sm text-muted-foreground">Add, edit, or remove entries from your technology radars</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleRadarSwitch("technology")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              selectedRadar === "technology"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Technology Radar
          </button>
          <button
            onClick={() => handleRadarSwitch("ai")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              selectedRadar === "ai" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            AI Radar
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setEditingEntry(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Add New Entry
        </button>
        <button
          onClick={handleExport}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          📋 Export to Clipboard
        </button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <EntryForm
          config={currentConfig}
          entry={editingEntry}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
        />
      )}

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Entries ({entries.length}) - {currentConfig.title}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold">{entry.name}</h3>
                {entry.moved !== 0 && (
                  <span className="text-xs text-muted-foreground">{entry.moved === 1 ? "↑" : "↓"}</span>
                )}
              </div>

              <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{entry.description}</p>

              <div className="mb-3 space-y-1 text-xs">
                <div>
                  <strong>Quadrant:</strong> {currentConfig.quadrants[entry.quadrant].name}
                </div>
                <div>
                  <strong>Ring:</strong> {currentConfig.rings[entry.ring]}
                </div>
                <div>
                  <strong>Updated:</strong> {entry.last_update}
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-1">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingEntry(entry);
                    setShowForm(true);
                  }}
                  className="flex-1 rounded bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="rounded bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Entry Form Component
interface EntryFormProps {
  config: RadarConfig;
  entry: RadarEntry | null;
  onSubmit: (entry: RadarEntry) => void;
  onCancel: () => void;
}

function EntryForm({ config, entry, onSubmit, onCancel }: EntryFormProps) {
  const [formData, setFormData] = useState<RadarEntry>(
    entry || {
      id: "",
      name: "",
      quadrant: 0,
      ring: 0,
      description: "",
      tags: [],
      url: "",
      image: "",
      moved: 0,
      last_update: new Date().toISOString().split("T")[0],
    }
  );

  const handleChange = (field: keyof RadarEntry, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData({ ...formData, tags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.id || !formData.name) {
      alert("ID and Name are required");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-6">
      <h3 className="mb-4 text-lg font-semibold">{entry ? "Edit Entry" : "New Entry"}</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* ID */}
        <div>
          <label className="mb-1 block text-sm font-medium">ID *</label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => handleChange("id", e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="e.g., docker"
            disabled={!!entry}
          />
        </div>

        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="e.g., Docker"
          />
        </div>

        {/* Quadrant */}
        <div>
          <label className="mb-1 block text-sm font-medium">Quadrant *</label>
          <select
            value={formData.quadrant}
            onChange={(e) => handleChange("quadrant", parseInt(e.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {config.quadrants.map((q, i) => (
              <option key={i} value={i}>
                {q.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ring */}
        <div>
          <label className="mb-1 block text-sm font-medium">Ring *</label>
          <select
            value={formData.ring}
            onChange={(e) => handleChange("ring", parseInt(e.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {config.rings.map((r, i) => (
              <option key={i} value={i}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* URL */}
        <div>
          <label className="mb-1 block text-sm font-medium">URL (optional)</label>
          <input
            type="url"
            value={formData.url || ""}
            onChange={(e) => handleChange("url", e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>

        {/* Image */}
        <div>
          <label className="mb-1 block text-sm font-medium">Image Path (optional)</label>
          <input
            type="text"
            value={formData.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="/radar/docker-logo.png"
          />
        </div>

        {/* Moved */}
        <div>
          <label className="mb-1 block text-sm font-medium">Movement</label>
          <select
            value={formData.moved}
            onChange={(e) => handleChange("moved", parseInt(e.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value={0}>No change</option>
            <option value={1}>Moved up</option>
            <option value={-1}>Moved down</option>
          </select>
        </div>

        {/* Last Update */}
        <div>
          <label className="mb-1 block text-sm font-medium">Last Update *</label>
          <input
            type="date"
            value={formData.last_update}
            onChange={(e) => handleChange("last_update", e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags.join(", ")}
            onChange={(e) => handleTagsChange(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="containers, devops, infrastructure"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            rows={4}
            placeholder="Brief description of the technology..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {entry ? "Update Entry" : "Add Entry"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
