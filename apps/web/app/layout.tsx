import { Geist_Mono, Oxanium } from "next/font/google"
import "@workspace/ui/globals.css"
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })
import { cn } from "@workspace/ui/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

import { NoxLayout } from "@nox/layouts"
import type { NoxSidebarMenu } from "@nox/layouts"

export const sidebarMenu: NoxSidebarMenu[] = [
  {
    type: "main-mobile",
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
    ],
  },

  {
    type: "main",
    label: "Documentation",
    items: [
      {
        title: "Introduction",
        url: "/docs/index",
      },
      {
        title: "Installation",
        url: "/docs/installation",
      },
      {
        title: "Manual",
        url: "/docs/manual",
      },
      {
        title: "Nox Layout",
        url: "/docs/nox-layout",
      },
      {
        title: "Mdx Layout",
        url: "/docs/mdx-layout",
      },
      {
        title: "CLI",
        url: "/docs/cli",
      },
    ],
  },
  {
    type: "main",
    label: "Components",
    items: [
      {
        title: "Components Preview",
        url: "/docs/mdx/component-preview",
      },
      {
        title: "Code Block",
        url: "/docs/mdx/code-block",
      },
      {
        title: "Code Diff",
        url: "/docs/mdx/code-diff",
      },
      {
        title: "Package Manager",
        url: "/docs/mdx/package-manager-tabs",
      },
      {
        title: "Project Tree",
        url: "/docs/mdx/project-tree",
      },
      {
        title: "Terminal View",
        url: "/docs/mdx/terminal-view",
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
          <NoxLayout targetDir={["/docs"]} menu={sidebarMenu}>
            {children}
          </NoxLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
