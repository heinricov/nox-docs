"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeftIcon } from "lucide-react"

import { Button } from "@nox/core/components/button"
import { Separator } from "@nox/core/components/separator"
import { useSidebar } from "@nox/core/components/sidebar"
import { cn } from "@nox/core/lib/utils"
import { SearchForm } from "@nox/core/layouts/search-form"
import { NavLogo } from "./nav-logo"
import { ButtonTheme } from "./button-theme"
import { RiTwitterXFill } from "react-icons/ri"
import { FaGithub } from "react-icons/fa"

const navItems = [
  { title: "Home", href: "/" },
  { title: "Documentation", href: "/docs" },
]

type DefaultHeaderProps = {
  githubUrl?: string
  twitterUrl?: string
  logo?: ReactNode
}

export function DefaultHeader({
  githubUrl,
  twitterUrl,
  logo,
}: DefaultHeaderProps) {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()

  const socials = [
    ...(twitterUrl
      ? [{ title: "Twitter / X", href: twitterUrl, icon: RiTwitterXFill }]
      : []),
    ...(githubUrl
      ? [{ title: "GitHub", href: githubUrl, icon: FaGithub }]
      : []),
  ]

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
          {logo ?? <NavLogo />}
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
          <ul className="flex items-center gap-4">
            {socials.map(({ title, href, icon: Icon }) => (
              <li key={title}>
                <Link href={href} aria-label={title}>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
