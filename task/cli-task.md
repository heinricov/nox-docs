# Nox Cli

## Manual Setup

### [x] nox cli memiliki printah "npm install nox"

- [x] perintah ini membuat user yang menginstall nox bisa import `import { NoxLayout } from "@nox/layouts"` sperti di @apps/web/app/layout.tsx
- [x] perintah ini membuat user yang menginstall nox bisa import `import type { NoxSidebarMenu } from "@nox/layouts"` sperti di @apps/web/app/layout.tsx

  > Catatan: task asli menulis `from "@nox"`, tapi `@nox` (scope tanpa nama) bukan nama paket npm yang valid (npm menolak EINVALIDPACKAGENAME). Disepakati memakai `@nox/layouts`, sesuai import asli di apps/web/app/layout.tsx.

- [x] perintah ini membuat user yang menginstall nox bisa import `import { NoxRender } from "@nox/render"` sperti di @apps/web/app/[...docs]/.page.tsx

## Verifikasi

- [x] `npm install nox` dari tarball di sandbox/nextjs → typecheck + `next build` sukses
- [x] `npm install nox` dari tarball di sandbox/vite → typecheck sukses
- [x] Paket transitif: `nox` → `@nox/layouts` + `@nox/render` → `@nox/core`
