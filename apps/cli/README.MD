# NOX DOCS - Framework Documentation

Ada 3 cara instal:

1. template (nextjs/vite/tanstack + shadcn & nox)
2. Manual (nextjs/vite/tanstack + shadcn & nox)
3. Shadcn create (nextjs/vite/tanstack + nox)

Template:

- npx nox@latest templates
- Pilih (nextjs/vite/tanstack)

Manual :

- Install framework (nextjs/vite/tanstackroute)
- npm install nox@latest
- Import NoxLayout dari @nox/layouts di rootlayout
- Buat folder content di root project
- Buat halaman untuk directory dokumentasi dengan file .mdx misalnya content/docs/index.mdx
- Import NoxRenderMdx dari @nox/docs di nesting slug page.tsx, panggil directory docs dari folder content di props targetDir

Shadcn create :

- npx shadcn@latest init --preset b5KIUwOLw --template next --monorepo --pointer
