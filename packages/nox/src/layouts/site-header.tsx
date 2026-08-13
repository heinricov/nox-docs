"use client"

import { SearchForm } from "@nox/layouts/search-form"
import { Button } from "@nox/components/button"
import { Separator } from "@nox/components/separator"
import { useSidebar } from "@nox/components/sidebar"
import { PanelLeftIcon } from "lucide-react"
import { NavLogo } from "./nav-logo"
import { ButtonTheme } from "./button-theme"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center justify-between gap-2 px-2">
        <div className="mr-auto flex items-center">
          <Button
            className="flex items-center sm:hidden"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <PanelLeftIcon className="h-10 w-10" size="2xl" />
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 sm:hidden data-vertical:h-4 data-vertical:self-auto"
          />
          <NavLogo />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchForm className="hidden sm:block" />
          <ButtonTheme />
        </div>
      </div>
    </header>
  )
}
