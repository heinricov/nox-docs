[x] Create git repo project
[x] Setup Clack CLI
[x] Setup packages/nox
[x] Setup packages/nox/layouts
[x] Setup packages/nox/rendermdx

## Rename @nox -> @nox/core + wrappers

Karena `@nox` (bare scope) bukan nama npm yang valid, `packages/nox` diubah nama menjadi `@nox/core` dan dibuat wrapper publishable:

- [x] packages/layouts (nama `@nox/layouts`) — re-export `@nox/core/layouts`
- [x] packages/render (nama `@nox/render`) — re-export `@nox/core/render`
- [x] apps/cli (nama `nox`) — dependency transitif `@nox/layouts` + `@nox/render`

## Publikasi & verifikasi (v0.0.1)

- [x] Repack tarball: `nox-core-0.0.1.tgz`, `nox-layouts-0.0.1.tgz`, `nox-render-0.0.1.tgz`, `nox-0.0.1.tgz`
- [x] sandbox/nextjs: install tarball, `tsc --noEmit`, `next build` sukses
- [x] sandbox/vite: install tarball, `tsc --noEmit` sukses
- [x] Docs: `apps/web/content/docs/manual.mdx` + sidebar + meta.ts
