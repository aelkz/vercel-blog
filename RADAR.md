# Technology Radar Management

This guide explains how to manage and update your Technology and AI Radar pages.

## Overview

The radar system helps you track and visualize technologies, tools, and techniques you're exploring or using. It's based on [Neal Ford's approach](https://nealford.com/memeagora/2013/05/28/build_your_own_technology_radar.html) to building personal technology radars.

**Live Pages:**

- Technology Radar: `/technology-radar`
- AI Radar: `/ai-radar`
- Admin Interface: `/admin/radar` (development mode only)

## File Structure

```
lib/
├── radar-types.ts              # TypeScript interfaces
├── technology-radar-data.ts    # Technology radar entries
└── ai-radar-data.ts           # AI radar entries
```

## Quick Start

### 1. Using the Admin Interface (Development Mode)

The easiest way to manage radar entries is through the built-in admin interface:

```bash
pnpm dev
```

Navigate to `http://localhost:3000/admin/radar`

**Features:**

- Add, edit, or delete entries
- Switch between Technology and AI radars
- Export changes to clipboard
- Visual preview of the radar

**Workflow:**

1. Make your changes in the admin interface
2. Click "Export to Clipboard"
3. Paste the exported code into the appropriate data file
4. Commit and push your changes
5. Vercel automatically deploys

### 2. Editing Data Files Directly

You can also edit the TypeScript files directly:

**Technology Radar:**

```typescript
// lib/technology-radar-data.ts
export const technologyRadar: RadarConfig = {
  entries: [
    {
      id: "docker",
      name: "Docker",
      quadrant: 1, // 0=Techniques, 1=Tools, 2=Platforms, 3=Languages & Frameworks
      ring: 0, // 0=Adopt, 1=Trial, 2=Assess, 3=Hold
      description: "Container platform for building and running applications...",
      tags: ["containers", "devops"],
      url: "https://www.docker.com/",
      image: "/radar/docker-logo.png", // Optional
      moved: 1, // -1=down, 0=no change, 1=up
      last_update: "2025-01-15",
    },
  ],
};
```

**AI Radar:**

```typescript
// lib/ai-radar-data.ts
export const aiRadar: RadarConfig = {
  quadrants: [
    { name: "LLM Tools", color: "#8FA1B3" },
    { name: "AI Platforms", color: "#B48EAD" },
    { name: "ML Frameworks", color: "#A3BE8C" },
    { name: "AI Techniques", color: "#CD853F" },
  ],
  // ... entries
};
```

## Understanding the Structure

### Quadrants (4 per radar)

Each radar has 4 quadrants representing different categories. You can customize these per radar:

**Technology Radar:**

- Techniques (0)
- Tools (1)
- Platforms (2)
- Languages & Frameworks (3)

**AI Radar:**

- LLM Tools (0)
- AI Platforms (1)
- ML Frameworks (2)
- AI Techniques (3)

### Rings (Same for all radars)

- **Adopt (0)** - Proven and ready for use
- **Trial (1)** - Worth pursuing with low risk
- **Assess (2)** - Worth exploring to understand potential
- **Hold (3)** - Proceed with caution

### Entry Fields

| Field         | Type     | Required | Description                                     |
| ------------- | -------- | -------- | ----------------------------------------------- |
| `id`          | string   | Yes      | Unique identifier (lowercase, hyphenated)       |
| `name`        | string   | Yes      | Display name                                    |
| `quadrant`    | number   | Yes      | Index 0-3 (see quadrants above)                 |
| `ring`        | number   | Yes      | Index 0-3 (Adopt/Trial/Assess/Hold)             |
| `description` | string   | Yes      | Brief explanation                               |
| `tags`        | string[] | Yes      | Category tags for filtering                     |
| `url`         | string   | No       | Link for more info                              |
| `image`       | string   | No       | Path to logo/icon (e.g., `/radar/logo.png`)     |
| `moved`       | number   | No       | Movement indicator: -1 (down), 0 (none), 1 (up) |
| `last_update` | string   | Yes      | Date in YYYY-MM-DD format                       |

## Common Tasks

### Adding a New Entry

**Via Admin Interface:**

1. Go to `/admin/radar`
2. Click "Add New Entry"
3. Fill in the form
4. Click "Add Entry"
5. Click "Export to Clipboard"
6. Paste into the appropriate file

**Via Direct Edit:**

1. Open `lib/technology-radar-data.ts` or `lib/ai-radar-data.ts`
2. Add a new entry object to the `entries` array
3. Save the file

### Moving an Entry Between Rings

Change the `ring` value and set `moved` to indicate direction:

```typescript
{
  id: "kubernetes",
  ring: 0,  // Changed from 1 (Trial) to 0 (Adopt)
  moved: 1, // Moved up
  last_update: "2025-01-15"  // Update date
}
```

### Adding Images

1. Place image files in `public/radar/` (e.g., `public/radar/docker-logo.png`)
2. Reference in entry: `image: "/radar/docker-logo.png"`

Recommended image specs:

- Format: PNG or SVG
- Size: 64x64px or smaller
- Transparent background

### Customizing Quadrant Colors

Edit the quadrant colors in the radar config:

```typescript
quadrants: [
  { name: "Tools", color: "#B48EAD" }, // Change hex color
];
```

## Deployment Workflow

1. **Make changes** - Use admin interface or edit files directly
2. **Test locally** - Run `pnpm dev` and check `/technology-radar` and `/ai-radar`
3. **Commit** - `git add . && git commit -m "Update technology radar"`
4. **Push** - `git push origin main`
5. **Auto-deploy** - Vercel automatically deploys your changes

## Tips

- **Keep descriptions concise** - 1-3 sentences work best
- **Update regularly** - Quarterly updates help track your evolving opinions
- **Use movement indicators** - Show what's gaining or losing traction
- **Add URLs** - Link to official documentation or your blog posts
- **Tag consistently** - Reuse tags across entries for better organization
- **Avoid overlapping** - The system has basic collision detection, but too many entries in one ring/quadrant can look cluttered

## Troubleshooting

### Changes Not Showing

- Restart dev server: `pnpm dev`
- Clear Next.js cache: `rm -rf .next && pnpm dev`
- Check for syntax errors in the data files

### Admin Interface Data Loss Warning

When switching between radars in the admin interface, you'll see a confirmation prompt if you have unsaved changes. Always export to clipboard before switching!

### Build Errors

- Ensure all required fields are filled
- Check that `quadrant` and `ring` values are valid (0-3)
- Verify date format is YYYY-MM-DD
- Make sure all entries have unique IDs

## Examples

Check the existing entries in the data files for reference:

- `lib/technology-radar-data.ts` - 17 example technology entries
- `lib/ai-radar-data.ts` - 5 example AI entries

## Next Steps

- Customize your radars with your own technologies
- Update the quadrant names to match your categories
- Add images/logos for visual appeal
- Share your radar pages with your team or community

Happy radar building!
