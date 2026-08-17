# Noxkit CLI

## Manual Setup

### [x] noxkit CLI memiliki perintah "npm install noxkit"

- [x] perintah ini membuat user yang menginstall noxkit bisa import dari satu paket:
  ```ts
  import { NoxLayout, NoxRender } from "noxkit"
  import type { NoxSidebarMenu, GroupMenuItem } from "noxkit"
  ```
- [x] paket `@nox/layouts` dan `@nox/render` telah dihapus, semua export ada di `noxkit`
- [x] CLI package di-rename menjadi `@nox/cli` (tidak konflik dengan library `noxkit`)

### [x] Upload ke npm

- [ ] Login ke npm: `npm login`
- [ ] Build CLI: `cd apps/cli && npm run build`
- [ ] Publish library: `cd packages/nox && npm publish`
- [ ] Publish CLI: `cd apps/cli && npm publish`
- [ ] Verifikasi: `npm install -g @nox/cli && noxkit --version`

### [x] Update setelah perubahan file

- [ ] Edit file di `packages/nox/src/`
- [ ] Bump version di `packages/nox/package.json`
- [ ] Publish: `cd packages/nox && npm publish`
- [ ] Untuk CLI: edit di `apps/cli/src/`, bump version, lalu `cd apps/cli && npm publish`

## Verifikasi

- [x] `npm install noxkit` dari tarball di sandbox/nextjs → typecheck + `next build` sukses
- [x] `npm install noxkit` dari tarball di sandbox/vite → typecheck sukses
- [x] Semua export dari satu paket `noxkit` (layouts, render, components, lib, hooks)
