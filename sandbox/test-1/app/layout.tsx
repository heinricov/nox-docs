import type { ReactNode } from "react"
import { NoxLayout } from "noxkit"
import type { NoxSidebarMenu } from "noxkit"

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <NoxLayout
          defaultTheme="system"
          targetDir={["/docs"]}
          menu={sidebarMenu}
        >
          {children}
        </NoxLayout>
      </body>
    </html>
  )
}
