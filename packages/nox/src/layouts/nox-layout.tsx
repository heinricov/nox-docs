import { SidebarInset, SidebarProvider } from "@nox/components/sidebar"
import { SiteHeader } from "@nox/layouts/site-header"
import { TooltipProvider } from "@nox/components/tooltip"
import { AppSidebar } from "./app-sidebar"

import "@nox/styles/globals.css"

export function NoxLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
