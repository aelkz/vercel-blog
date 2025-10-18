# Setup Guide

Welcome to the Modern Developer Blog Template! This guide will help you get started with setting up and customizing your digital garden.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v20 LTS (required - v24 is not compatible with Contentlayer)
  - If using nvm: `nvm use` (will automatically use the version in `.nvmrc`)
  - Or download from: https://nodejs.org/
- **pnpm** (recommended) or npm/yarn
  - Install pnpm: `npm install -g pnpm`
- **Git** (for version control)

**IMPORTANT:** This project requires Node.js v20. Node.js v24 has compatibility issues with Contentlayer 0.3.4 and will cause build errors.

## Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
# Install dependencies
pnpm install
```

### 2. Configuration

Before running the development server, you should configure the site metadata:

#### Essential Configuration Files

Edit these files with your personal information:

1. **`lib/metadata.ts`** - Site metadata and author information
   - Update `defaultAuthor` object with your name, email, job title, etc.
   - Configure site settings like title, description, and theme

2. **`lib/navigation-links.ts`** - Navigation menu links
   - Add/remove navigation items as needed

3. **`lib/social-data.ts`** - Social media profiles
   - Add your social media handles and URLs

4. **`lib/uses-data.ts`** - Software and hardware you use (for `/uses` page)

5. **`lib/projects-data.ts`** - Your projects (for `/projects` page)

6. **`package.json`** - Update author information
   - Change `name`, `author.name`, `author.url`, and `repository` fields

### 3. Content Setup

Edit the following content files to personalize your blog:

- **`content/pages/about.mdx`** - Your bio and about page
- **`content/pages/now.mdx`** - Your current availability/status
- **`content/posts/`** - Add your blog posts here (see [Writing Content](#writing-content))

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/                    # Next.js App Router pages and layouts
│   ├── (site)/            # Main site pages
│   └── api/               # API routes (RSS, newsletter, etc.)
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── content/              # Your content (MDX files)
│   ├── pages/           # Static pages (about, now, etc.)
│   ├── posts/           # Blog posts
│   └── projects/        # Project descriptions
├── lib/                  # Utilities and configuration
│   ├── metadata.ts      # Site metadata
│   ├── navigation-links.ts
│   ├── social-data.ts
│   ├── uses-data.ts
│   └── projects-data.ts
├── public/              # Static assets (images, icons, etc.)
└── types/               # TypeScript type definitions
```

## Writing Content

### Creating Blog Posts

1. Create a new `.mdx` file in `content/posts/`
2. Add frontmatter at the top:

```yaml
---
title: "Your Post Title"
publishedDate: "2024-01-15"
lastUpdatedDate: "2024-01-15"
description: "A brief description of your post"
status: "published"
tags:
  - javascript
  - react
series:
  title: "Series Name"
  order: 1
---
```

3. Write your content using Markdown/MDX syntax

### Frontmatter Fields

- **`title`** - Post title (required)
- **`description`** - Brief description for SEO and previews (required)
- **`publishedDate`** - Publication date in YYYY-MM-DD format
- **`lastUpdatedDate`** - Last update date
- **`status`** - Either `published` or `draft`
- **`tags`** - Array of tags (must match options in config)
- **`series`** - Group posts into a series with title and order
- **`author`** - Author information (name and image)

### MDX Features

This template supports enhanced MDX features:

- **Code highlighting** - Syntax highlighting for code blocks
- **Math equations** - KaTeX support for mathematical notation
- **Table of contents** - Automatic TOC generation
- **Custom components** - Use React components in your content

## Customization

### Changing Fonts

Edit `app/layout.tsx` and use Next.js font loader:

```typescript
import { Inter } from "next/font/google";
```

### Changing Colors

Customize theme colors in `app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    /* ... other color variables */
  }
}
```

### Hero Section

Choose between 4 hero variants in `app/(site)/page.tsx`:

1. `HeroSimple` - Centered with image, title, and subtitle
2. `HeroVideo` - Two columns with video embed
3. `HeroImage` - Two columns with image
4. `HeroMinimal` - Small hero with name and job title

### Custom Signature

Edit `components/signature.tsx` to add your personal signature to the footer.

## Optional Integrations

### Analytics

The template supports multiple analytics providers:

#### Vercel Analytics

- Enable in your Vercel project dashboard
- No environment variables needed

#### Umami

```bash
NEXT_PUBLIC_UMAMI_SCRIPT_URL=your-script-url
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

#### Plausible

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=script-url
```

#### Google Analytics

```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-XXXXX
```

Set the `analyticsProvider` in `lib/metadata.ts` to match your choice.

### Newsletter

#### MailerLite

```bash
EMAIL_API_BASE=https://connect.mailerlite.com/api
EMAIL_API_KEY=your-api-key
EMAIL_GROUP_ID=your-group-id
```

Set `newsletterProvider` to `"mailerlite"` in `lib/metadata.ts`.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables:
   - `NEXT_PUBLIC_BASE_URL` - Your site URL (e.g., `https://yourdomain.com`)
   - Add analytics/newsletter variables if using them
4. Deploy!

### Environment Variables

Create a `.env.local` file for local development:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=

# Newsletter (optional)
EMAIL_API_BASE=
EMAIL_API_KEY=
EMAIL_GROUP_ID=
```

**Note:** Never commit `.env.local` to version control!

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Tips for Success

1. **Start Small** - Configure metadata first, then customize one section at a time
2. **Test Locally** - Always test changes locally before deploying
3. **Use Git** - Commit changes frequently
4. **Optimize Images** - Use tools like [ImageOptim](https://imageoptim.com/) to reduce image file sizes
5. **Read the Docs** - Check the main [README.md](./README.md) for detailed documentation

## Common Tasks

### Adding a New Page

1. Create `content/pages/your-page.mdx`
2. Add frontmatter and content
3. Add navigation link in `lib/navigation-links.ts` (optional)

### Changing the Homepage Avatar

See the [video tutorial](https://youtu.be/Ny-VaEEhJKM) on creating a custom avatar in Figma.

### Adding Custom Components

Create components in `components/` and import them in your MDX files:

```mdx
import { CustomComponent } from "@/components/custom-component";

<CustomComponent prop="value" />
```

## Troubleshooting

### Build Errors

- **"Unexpected identifier 'assert'" error**: You're likely using Node.js v24. Switch to Node.js v20 LTS:
  - With nvm: `nvm install 20 && nvm use 20`
  - Or download Node.js v20 from https://nodejs.org/
- Ensure all dependencies are installed: `pnpm install`
- Clear `.contentlayer` cache: `rm -rf .contentlayer`
- Check that all frontmatter fields are valid

### Content Not Showing

- Verify `status: "published"` in frontmatter
- Check file is in correct directory (`content/posts/` or `content/pages/`)
- Restart dev server after adding new content

### Styling Issues

- Clear browser cache
- Check `tailwind.config.js` configuration
- Verify CSS imports in `app/globals.css`

## Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review [existing examples](./README.md#examples)
- Open an issue on [GitHub](https://github.com/thedevdavid/digital-garden/issues)

## Next Steps

1. Customize your metadata in `lib/metadata.ts`
2. Write your first blog post in `content/posts/`
3. Update your about page in `content/pages/about.mdx`
4. Choose and configure analytics
5. Deploy to Vercel
6. Share your digital garden with the world!

Happy blogging!
