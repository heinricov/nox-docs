# nox — Documentation Framework

Starter untuk situs dokumentasi berbasis MDX untuk Next.js dan Vite React.

## Instalasi

```bash
npm install nox
```

Perintah di atas menginstal `nox` beserta paket `@nox` secara transitif,
sehingga Anda bisa langsung memakai import berikut:

```ts
import { NoxLayout } from "@nox/layouts"
import type { NoxSidebarMenu } from "@nox/layouts"
import { NoxRender } from "@nox/render"
```

## Setup manual

1. `npm install nox`
2. Next.js: tambahkan paket ke `transpilePackages` di `next.config.ts`

   ```ts
   const nextConfig = {
     transpilePackages: ["@nox/core", "@nox/layouts", "@nox/render"],
   }
   ```

3. Edit root layout (`app/layout.tsx`) dengan `NoxLayout` dan menu
   bertipe `NoxSidebarMenu[]`
4. Buat route dokumentasi (`app/[...docs]/page.tsx`) yang merender
   `NoxRender` dengan `targetDir` dan slug dari URL
5. Buat folder `content` dan file MDX (mis. `content/docs/index.mdx`)

Panduan lengkap tersedia di situs dokumentasi nox.
