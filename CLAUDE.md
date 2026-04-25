# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a pnpm monorepo for a personal blog ("Alfr3d's Blog"). It consists of three packages under `packages/`:

- **`@blog-v3/app`** — Next.js 13 blog application using the App Router.
- **`@blog-v3/core`** — Vite-built TypeScript library for markdown processing (frontmatter parsing, HTML conversion). Includes Vitest tests.
- **`@blog-v3/lib`** — Vite-built React component library with Storybook. Currently exports a single `Button` component with Tailwind styling.

## Development Commands

All commands should be run from the repository root unless noted otherwise.

### Install dependencies
```bash
pnpm install
```

### Start development
```bash
# Run the Next.js app dev server
pnpm dev
```

### Build
```bash
# Build the Next.js app (production)
pnpm build

# Build library dependencies (core + lib) in parallel
pnpm build:deps

# Build individual packages
pnpm build:core
pnpm build:lib
```

### Testing
```bash
# Run tests (only the core package has tests)
pnpm --filter @blog-v3/core test

# Run tests with coverage
pnpm --filter @blog-v3/core test:coverage
```

### Linting / Formatting
```bash
# Run Prettier across all packages
pnpm lint
```

### Storybook (component library)
```bash
# Run Storybook for @blog-v3/lib
pnpm --filter @blog-v3/lib storybook
```

## High-Level Architecture

### Content Layer

Blog posts are stored as markdown files with YAML frontmatter in `packages/app/resource/`, organized into four directories:

- `_techs` — technical articles
- `_blogs` — general blog posts
- `_about` — about page content
- `_short` — short-form content

**Important:** The `app` package does **not** import `@blog-v3/core` as a workspace dependency. Instead, it maintains a copy of the same markdown-processing logic under `packages/app/src/core/`. Any changes to markdown reading or HTML conversion may need to be mirrored in both places, or the app should be refactored to depend on `@blog-v3/core`.

The `MarkdownReader` class (`packages/core/src/markdown-getter/index.ts`) reads files via Node `fs`, parses frontmatter with `gray-matter`, converts markdown to HTML with `remark` + `remark-html`, and sorts posts by date descending.

### App Router Structure

The Next.js app uses the App Router (`packages/app/src/app/`):

- `/` — Home page with animated intro using `react-rough-notation` and a `WordTree` background animation.
- `/blogs` — Lists all posts from `_techs` and `_blogs`, sorted by date.
- `/blogs/[slug]` — Renders a single blog post. Uses `dangerouslySetInnerHTML` for the rendered markdown.
- `/about`, `/playground`, `/short` — Additional static/dynamic pages under `(other)` route group.

Layout (`app/layout.tsx`) wraps all pages with a `ThemeProvider` (dark mode via `next-themes`), `Header`, `Footer`, and `TailwindIndicator`.

### Component Library (`@blog-v3/lib`)

Built with Vite + `@vitejs/plugin-react-swc` + `vite-plugin-dts` for type declarations. Uses Tailwind CSS. Storybook 7 is configured for isolated component development.

### Styling

- **Tailwind CSS** is used in both `app` and `lib`.
- Dark mode is class-based (`darkMode: "class"`) and toggled via `next-themes`.
- The `cn()` utility in `packages/app/src/utils/index.ts` combines `clsx` and `tailwind-merge` for conditional class merging.
- `@tailwindcss/typography` provides `prose` classes for rendered markdown.
- Google Fonts are loaded via `next/font`: Noto Sans Mono (body) and Caveat (headings).

## TypeScript / Path Aliases

- **`@blog-v3/app`**: `@/*` maps to `./src/*`.
- **`@blog-v3/core`** and **`@blog-v3/lib`**: no custom path aliases configured.

## ESLint / Prettier Configuration

- ESLint is configured at the root (`.eslintrc.cjs`) with TypeScript, React Hooks, React Refresh, and Storybook rules.
- Prettier config (`.prettierrc`) uses single quotes, trailing commas (`es5`), 2-space tabs, 80 print width, and avoids arrow parentheses.
