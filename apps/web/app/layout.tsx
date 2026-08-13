import { Geist_Mono, Oxanium } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })

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

  {
    type: "collaps",
    label: "Components",
    items: [
      {
        title: "Tools",
        url: "#",
        items: [
          {
            title: "Code Block",
            url: "/components/code-block",
          },
          {
            title: "Inline",
            url: "/components/inline",
          },
        ],
      },

      {
        title: "UI",
        url: "#",
        items: [
          {
            title: "Card",
            url: "/components/card",
          },
          {
            title: "Avatar",
            url: "/components/avatar",
          },
        ],
      },
    ],
  },

  {
    type: "main",
    label: "Menus",
    items: [
      {
        title: "Settings",
        url: "/setting",
      },
      {
        title: "About",
        url: "/about",
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
          <NoxLayout menu={sidebarMenu}>{children}</NoxLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
