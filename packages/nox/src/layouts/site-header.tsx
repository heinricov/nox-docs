"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeftIcon } from "lucide-react"

import { Button } from "../components/button"
import { Separator } from "../components/separator"
import { useSidebar } from "../components/sidebar"
import { cn } from "../lib/utils"
import { SearchForm } from "./search-form"
import { NavLogo } from "./nav-logo"
import { ButtonTheme } from "./button-theme"

const navItems = [
  { title: "Home", href: "/" },
  { title: "Documentation", href: "/docs" },
]

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2 sm:px-4">
        <Button
          className="shrink-0 sm:hidden"
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="sm:hidden data-vertical:h-4 data-vertical:self-auto"
        />

        <div className="flex min-w-0 items-center gap-1 sm:gap-10">
          <NavLogo />
          <nav className="hidden items-center sm:flex">
            <ol className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors lg:px-3 lg:text-sm",
                      isActive(item.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <SearchForm className="hidden lg:block" />
          <ButtonTheme />
        </div>
      </div>
    </header>
  )
}
