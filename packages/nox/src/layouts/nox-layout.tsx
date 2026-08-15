"use client"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@nox/core/hooks/use-media-query"
import type { NoxSidebarMenu } from "@nox/core/layouts"
import { SidebarInset, SidebarProvider } from "@nox/core/components/sidebar"
import { SiteHeader } from "@nox/core/layouts/site-header"
import { TooltipProvider } from "@nox/core/components/tooltip"
import { AppSidebar } from "./app-sidebar"

import "@nox/core/styles/globals.css"
import { AppFooter } from "./app-footer"

type NoxLayoutProps = {
  menu: NoxSidebarMenu[]
  children: ReactNode
  targetDir?: string | string[]
}

export function NoxLayout({ menu, children, targetDir }: NoxLayoutProps) {
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
          <SiteHeader />
          <div className="flex flex-1">
            {showSidebar && <AppSidebar menu={menu} />}
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
          <AppFooter />
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
