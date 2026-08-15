"use client"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@nox/core/hooks/use-media-query"
import type { NoxSidebarMenu } from "@nox/core/layouts"
import { SidebarInset, SidebarProvider } from "@nox/core/components/sidebar"
import { TooltipProvider } from "@nox/core/components/tooltip"
import { AppSidebar } from "./app-sidebar"
import { DefaultFooter } from "./default-footer"
import { DefaultHeader } from "./default-header"

import "@nox/core/styles/globals.css"

type NoxLayoutProps = {
  menu: NoxSidebarMenu[]
  children: ReactNode
  targetDir?: string | string[]
  navheader?: ReactNode
  navfooter?: ReactNode
}

export function NoxLayout({
  menu,
  children,
  targetDir,
  navheader = <DefaultHeader />,
  navfooter = <DefaultFooter />,
}: NoxLayoutProps) {
  const pathname = usePathname()

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const targetDirs = Array.isArray(targetDir) ? targetDir : [targetDir]

  const isTargetPath = targetDirs.some((dir) => {
    return pathname === dir || pathname.startsWith(`${dir}/`)
  })

  const showSidebar = !isDesktop || isTargetPath
  return (
    <TooltipProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          {navheader}
          <div className="flex flex-1">
            {showSidebar && <AppSidebar menu={menu} />}
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
          {navfooter}
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
