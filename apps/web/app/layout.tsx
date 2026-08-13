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
        title: "Installation",
        url: "/docs/installation",
      },
    ],
  },

  {
    type: "main",
    label: "Documentation",
    items: [
      {
        title: "Introduction",
        url: "/docs/introduction",
      },
      {
        title: "Installation",
        url: "/docs/installation",
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
        title: "Package Manager Tabs",
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
