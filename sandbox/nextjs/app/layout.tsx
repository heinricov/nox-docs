import type { ReactNode } from "react"
import "./globals.css"
import { NoxLayout } from "@nox/layouts"
import type { NoxSidebarMenu } from "@nox/layouts"

export const sidebarMenu: NoxSidebarMenu[] = [
  {
    type: "main",
    label: "Documentation",
    items: [
      {
        title: "Introduction",
        url: "/docs/index",
      },
    ],
  },
]

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NoxLayout targetDir={["/docs"]} menu={sidebarMenu}>
          {children}
        </NoxLayout>
      </body>
    </html>
  )
}
