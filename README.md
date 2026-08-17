<div align="center">

# ⚡ Noxkit

### Documentation Site Starter — Built with MDX, Next.js & Tailwind CSS

[![npm version](https://img.shields.io/npm/v/noxkit?label=noxkit&color=0ea5e9)](https://www.npmjs.com/package/noxkit)
[![npm version](https://img.shields.io/npm/v/noxkit-cli?label=noxkit-cli&color=8b5cf6)](https://www.npmjs.com/package/noxkit-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38bdf8)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-f69220)](https://pnpm.io)

**Noxkit** adalah toolkit all-in-one untuk membangun situs dokumentasi profesional. Cukup `npm install noxkit`, impor komponen yang dibutuhkan, dan dokumentasi siap dalam hitungan menit.

[Getting Started](#-quick-start) · [Documentation](https://nox-docs.vercel.app) · [Report Bug](https://github.com/your-username/nox-docs/issues)

</div>

---

## ✨ Features

| Fitur | Deskripsi |
|:------|:----------|
| 🎨 **NoxLayout** | Layout lengkap: header, sidebar, konten, footer — responsif otomatis |
| 📄 **NoxRender** | Renderer MDX server-side: breadcrumb, TOC, pagination — zero config |
| 🧩 **Components** | Button, Sidebar, Tabs, Dropdown, Sheet, Tooltip, dan lainnya |
| 🔍 **Search** | Pencarian built-in di sidebar |
| 🌙 **Dark Mode** | Theme switcher dark/light dengan satu komponen |
| 📱 **Responsive** | Sidebar desktop + sheet mobile, otomatis menyesuaikan |
| 🗂️ **Group Menu** | Navigasi terorganisir per kategori/version |
| 📝 **MDX Native** | Syntax highlighting, GFM, code block, project tree, terminal view |

---

## 📦 Packages

Monorepo ini menghasilkan **2 package** yang publish ke npm:

```
nox-docs/
├── packages/nox/          → noxkit          (library utama)
├── apps/cli/              → noxkit-cli      (CLI tool)
├── apps/web/              → nox-docs.vercel.app (dokumentasi)
├── packages/ui/           → @workspace/ui   (shared UI primitives)
├── sandbox/vite/          → testing ground
└── sandbox/nextjs/        → testing ground
```

| Package | npm | Deskripsi |
|:--------|:----|:----------|
| `noxkit` | [![npm](https://img.shields.io/npm/v/noxkit?color=0ea5e9)](https://npmjs.com/package/noxkit) | Library: layout, render, komponen, hooks, lib |
| `noxkit-cli` | [![npm](https://img.shields.io/npm/v/noxkit-cli?color=8b5cf6)](https://npmjs.com/package/noxkit-cli) | CLI: scaffolding & setup guide |

---

## 🚀 Quick Start

### 1. Install

```bash
npm install noxkit
```

### 2. Setup Next.js

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["noxkit"],
}

export default nextConfig
```

### 3. Root Layout

```tsx
// app/layout.tsx
import type { ReactNode } from "react"
import { NoxLayout } from "noxkit"
import type { NoxSidebarMenu } from "noxkit"

const sidebarMenu: NoxSidebarMenu[] = [
  {
    type: "main",
    label: "Documentation",
    items: [
      { title: "Introduction", url: "/docs/index" },
      { title: "Getting Started", url: "/docs/getting-started" },
    ],
  },
]

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NoxLayout targetDir={["/docs"]} menu={sidebarMenu}>
          {children}
        </NoxLayout>
      </body>
    </html>
  )
}
```

### 4. Documentation Page

```tsx
// app/[...docs]/page.tsx
import { NoxRender } from "noxkit"

export default async function DocsPage({
  params,
}: {
  params: Promise<{ docs?: string[] }>
}) {
  const { docs = [] } = await params
  const segments = docs[0] === "docs" ? docs.slice(1) : docs

  return <NoxRender dir="/docs" slug={segments.join("/")} />
}
```

### 5. Add Content

```mdx
<!-- content/docs/index.mdx -->
---
title: "Introduction"
description: "Welcome to the docs"
---

# Introduction

Selamat datang di dokumentasi Anda.
```

### 6. Run

```bash
npm run dev
```

Buka `/docs` — sidebar, breadcrumb, TOC, dan pagination sudah siap.

---

## 🧱 Components

Semua komponen bisa diimport langsung dari `noxkit`:

```tsx
// Root import — layouts & render
import { NoxLayout, NoxRender } from "noxkit"
import type { NoxSidebarMenu, GroupMenuItem } from "noxkit"

// Subpath import — individual components
import { Button } from "noxkit/components/button"
import { Sidebar } from "noxkit/components/sidebar"
import { Tabs } from "noxkit/components/tabs"

// Hooks & utilities
import { useSidebar } from "noxkit/components/sidebar"
import { cn } from "noxkit/lib/utils"
```

### Available Components

<details>
<summary><strong>Layout Components</strong></summary>

- `NoxLayout` — Main layout wrapper
- `DefaultHeader` — Header with logo, nav, search, theme toggle
- `DefaultSidebar` — Sidebar with navigation menu
- `DefaultFooter` — Footer with links & social icons
- `NavMain` — Flat navigation menu
- `NavCollaps` — Collapsible navigation menu
- `NavGroup` — Group switcher dropdown
- `SearchForm` — Search input in sidebar

</details>

<details>
<summary><strong>UI Components</strong></summary>

- `Button` — Button with variants
- `Sidebar` — Collapsible sidebar
- `Tabs` — Tab navigation
- `DropdownMenu` — Dropdown menu
- `Sheet` — Slide-out panel (mobile sidebar)
- `Tooltip` — Tooltip popup
- `Breadcrumb` — Breadcrumb navigation
- `Badge` — Status badge
- `Separator` — Visual separator
- `Skeleton` — Loading placeholder
- `Input` — Text input
- `Label` — Form label
- `Avatar` — User avatar
- `Table` — Data table

</details>

<details>
<summary><strong>MDX Components</strong></summary>

- `NoxRender` — Full MDX page renderer
- `CodeBlock` — Syntax-highlighted code block
- `CodeDiff` — Side-by-side code diff
- `ComponentPreview` — Live component preview
- `PackageManagerTabs` — npm/yarn/pnpm tab switcher
- `ProjectTree` — File tree visualization
- `TerminalView` — Terminal output display

</details>

---

## 🏗️ Tech Stack

| Technology | Purpose |
|:-----------|:--------|
| [Next.js 16](https://nextjs.org) | App Router, Server Components, RSC |
| [React 19](https://react.dev) | UI library |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS |
| [shadcn/ui](https://ui.shadcn.com) | Component primitives |
| [MDX Remote](https://github.com/hashicorp/next-mdx-remote) | MDX rendering |
| [Shiki](https://shiki.matsu.io) | Syntax highlighting |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Turborepo](https://turbo.build) | Monorepo build system |
| [pnpm](https://pnpm.io) | Fast, disk-efficient package manager |

---

## 🛠️ Development

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Setup

```bash
# Clone
git clone https://github.com/your-username/nox-docs.git
cd nox-docs

# Install
pnpm install

# Dev docs site
pnpm dev --filter web
```

### Available Scripts

```bash
pnpm dev          # Start all apps in dev mode
pnpm build        # Build all apps & packages
pnpm lint         # Lint all packages
pnpm format       # Format all files with Prettier
pnpm typecheck    # Type-check all packages
```

### Project Structure

```
nox-docs/
├── apps/
│   ├── cli/              # noxkit-cli — CLI tool
│   └── web/              # Documentation site (Next.js)
├── packages/
│   ├── nox/              # noxkit — Main library
│   ├── ui/               # Shared UI components
│   ├── eslint-config/    # Shared ESLint config
│   └── typescript-config/# Shared TypeScript config
├── sandbox/
│   ├── vite/             # Vite testing sandbox
│   └── nextjs/           # Next.js testing sandbox
└── task/                 # Development task notes
```

---

## 📖 Documentation

Visit the full documentation at **[nox-docs.vercel.app](https://nox-docs.vercel.app)**

- [Installation](/docs/installation) — Setup guide for Next.js & Vite
- [Manual Setup](/docs/manual) — Step-by-step manual configuration
- [NoxLayout](/docs/nox-layout) — Layout component API reference
- [Nox Sidebar](/docs/nox-sidebar) — Sidebar menu configuration
- [NoxRender](/docs/nox-render) — MDX renderer API reference

---

## 📄 License

MIT © [Noxkit](https://github.com/your-username/nox-docs)

---

<div align="center">

**Built with ⚡ by the Noxkit team**

</div>
