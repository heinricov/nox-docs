# Installasi

## Use Template

1. npx nox@latest template
2. pilih template yang diinginkan (nextjs, atau vite)
3. ini kan menghasilkan project yang diinginkan

### NextJS Template Structure

1. update layout.tsx

```tsx
import { Geist_Mono, Oxanium } from "next/font/google"
import "@workspace/ui/globals.css"
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

import { NoxLayout } from "@nox/layouts/nox-layout"
import type { SidebarMenu } from "@nox/layouts/sidebar"

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

2. Create [...docs]/page.tsx & [...blogs]/page.tsx

```tsx
// [...docs]/page.tsx
import { NoxLayout } from "@nox/layouts/nox-layout"
import type { SidebarMenu } from "@nox/layouts/sidebar"

export default function Page() {
  return (
    <NoxLayout targetDir={["/"]} menu={sidebarMenu}>
      <h1>Hello World</h1>
    </NoxLayout>
  )
}
```

```tsx
// [...blogs]/page.tsx
import { NoxLayout } from "@nox/layouts/nox-layout"
import type { SidebarMenu } from "@nox/layouts/sidebar"

export default function Page() {
  return (
    <NoxLayout targetDir={["/"]} menu={sidebarMenu}>
      <h1>Hello World</h1>
    </NoxLayout>
  )
}
```

3. Create folder penyimpanan file mdx `content`, `content/docs`, `content/blogs`

```
├── content
│   ├── docs
│       ├── index.mdx
│       ├── setup.mdx
│   ├── blogs
│       ├── index.mdx
│       ├── setup.mdx
```
