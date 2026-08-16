"use client"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@nox/core/hooks/use-media-query"
import type { NoxSidebarMenu } from "@nox/core/layouts"
import type { GroupMenuItem } from "@nox/core/layouts/nav-group"
import { SidebarInset, SidebarProvider } from "@nox/core/components/sidebar"
import { TooltipProvider } from "@nox/core/components/tooltip"
import { DefaultSidebar } from "./default-sidebar"
import { DefaultFooter } from "./default-footer"
import { DefaultHeader } from "./default-header"

import "@nox/core/styles/globals.css"

type NoxLayoutProps = {
  menu: NoxSidebarMenu[]
  groupmenu?: GroupMenuItem[]
  children: ReactNode
  targetDir?: string | string[]
  navheader?: ReactNode
  navside?: ReactNode
  navfooter?: ReactNode
  githubUrl?: string
  twitterUrl?: string
  copyRight?: string
  logo?: ReactNode
}

export function NoxLayout({
  menu,
  groupmenu,
  children,
  targetDir,
  githubUrl,
  twitterUrl,
  copyRight,
  logo,
  navheader = (
    <DefaultHeader githubUrl={githubUrl} twitterUrl={twitterUrl} logo={logo} />
  ),
  navside = <DefaultSidebar menu={menu} groupmenu={groupmenu} />,
  navfooter = (
    <DefaultFooter
      githubUrl={githubUrl}
      twitterUrl={twitterUrl}
      copyRight={copyRight}
      logo={logo}
    />
  ),
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
            {showSidebar && navside}
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
