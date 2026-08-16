import { Geist_Mono, Oxanium } from "next/font/google"
import type { Metadata } from "next"
import "@workspace/ui/globals.css"
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })
import { cn } from "@workspace/ui/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

import { NoxLayout } from "@nox/layouts"
import type { GroupMenuItem, NoxSidebarMenu } from "@nox/layouts"
import { NavHeader } from "@/components/nav-header"
import { NavFooter } from "@/components/nav-footer"
import { MyLogo } from "@/components/logo"
import icon from "./icon.png"
import { Cpu, Notebook } from "lucide-react"

export const metadata: Metadata = {
  title: {
    default: "Nox Docs",
    template: "%s | Nox Docs",
  },
  description: "Nox — starter untuk situs dokumentasi berbasis MDX.",
  applicationName: "Nox",
  keywords: ["nox", "dokumentasi", "mdx", "nextjs", "docs"],
  icons: {
    icon: icon.src,
  },
  openGraph: {
    type: "website",
    siteName: "Nox Docs",
    title: "Nox Docs",
    description: "Nox — starter untuk situs dokumentasi berbasis MDX.",
  },
}

const groupmenu: GroupMenuItem[] = [
  {
    title: "Basic Concept",
    icon: <Notebook className="size-4" />,
    description: "Basic concept",
  },
  {
    title: "Core Concept",
    icon: <Cpu className="size-4" />,
    description: "Core concept",
  },
]

const sidebarMenu: NoxSidebarMenu[] = [
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
        group: "Basic Concept",
      },
      {
        title: "Installation",
        url: "/docs/installation",
        group: "Basic Concept",
      },
      {
        title: "Manual",
        url: "/docs/manual",
        group: "Basic Concept",
      },
      {
        title: "Nox Layout",
        url: "/docs/nox-layout",
        group: "Core Concept",
      },
      {
        title: "Nox Sidebar",
        url: "/docs/nox-sidebar",
        group: "Core Concept",
      },
    ],
  },
  {
    type: "main",
    label: "Framework",
    group: "Core Concept",
    items: [
      {
        title: "Nextjs",
        url: "/docs/nextjs",
      },
      {
        title: "Vite React",
        url: "/docs/vite-react",
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
          <NoxLayout
            // navheader={<NavHeader />}
            // navfooter={<NavFooter />}
            githubUrl="https://github.com/nox-docs"
            twitterUrl="https://twitter.com/nox_docs"
            logo={<MyLogo />}
            targetDir={["/docs"]}
            menu={sidebarMenu}
            groupmenu={groupmenu}
          >
            {children}
          </NoxLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
