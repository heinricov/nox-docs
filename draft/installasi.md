# Installasi

## Use Template

1. npx nox@latest template
2. pilih template yang diinginkan (nextjs, atau vite)
3. ini kan menghasilkan project yang diinginkan

### NextJS Template Structure

1. layout.tsx sudah terupdate

2. Otomatis dibuatkan [...docs]/page.tsx

3. Otomatis dibuatkan folder penyimpanan file mdx `content`, `content/docs`

```
├── content
│   ├── docs
│       ├── index.mdx
│       ├── setup.mdx
```

### Saat Deploy

1. update eslint.config.ts

```ts
import { nextJsConfig } from "@workspace/eslint-config/next-js"

/** @type {import("eslint").Linter.Config} */
export default nextJsConfig
```

2. Delete type module di package.json

```json
{
  "type": "module"
}
```

## Use Manual

1. masuk ke folder project
2. jalankan printah npx nox@latest init
3. update layout.tsx

```tsx
import { Geist_Mono, Oxanium } from "next/font/google"
import "@workspace/ui/globals.css"
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

import { NoxLayout } from "@nox/layouts/"
import type { SidebarMenu } from "@nox/layouts/"

export const sidebarMenu: SidebarMenu[] = [
  {
    type: "main",
    label: "Menus",
    items: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Documentation",
        url: "/docs",
      },
      {
        title: "Blogs",
        url: "/blogs",
      },
    ],
  },
]

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        oxanium.variable
      )}
    >
      <body>
        <ThemeProvider>
          <NoxLayout targetDir={["/"]} menu={sidebarMenu}>
            {children}
          </NoxLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}

```

4. Create [...docs]/page.tsx & [...blogs]/page.tsx

```tsx
// [...docs]/page.tsx
import { MdxLayout } from "@nox/mdx-render/mdx-layout"

export default async function DocsPage({
  params,
}: {
  params: Promise<{ docs?: string[] }>
}) {
  const { docs = [] } = await params
  const segments = docs[0] === "docs" ? docs.slice(1) : docs

  return <MdxLayout dir="/docs" slug={segments.join("/")} />
}

```

jika ada folder blogs, maka perbaharui seperti berikut:

```tsx
// [...blogs]/page.tsx
import { MdxLayout } from "@nox/mdx-render/mdx-layout"

export default async function DocsPage({
  params,
}: {
  params: Promise<{ blogs?: string[] }>
}) {
  const { blogs = [] } = await params
  const segments = blogs[0] === "blogs" ? blogs.slice(1) : blogs

  return <MdxLayout dir="/blogs" slug={segments.join("/")} />
}

```

5. Create folder penyimpanan file mdx `content`, `content/docs`, jika butuh buat juga folder `content/blogs`

```
├── content
│   ├── docs
│       ├── index.mdx
│       ├── setup.mdx
│   ├── blogs
│       ├── index.mdx
│       ├── setup.mdx
```
