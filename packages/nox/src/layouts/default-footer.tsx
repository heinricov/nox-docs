"use client"

import type { ReactNode } from "react"
import Link from "next/link"

import { RiTwitterXFill } from "react-icons/ri"
import { FaGithub } from "react-icons/fa"
import { cn } from "../lib/utils"
import { NavLogo } from "./nav-logo"

const links = [
  {
    title: "About",
    href: "/#about",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
  {
    title: "Terms of Service",
    href: "/#terms",
  },
  {
    title: "Privacy Policy",
    href: "/#privacy",
  },
]

export function DefaultFooter({
  githubUrl,
  twitterUrl,
  copyRight,
  logo,
}: {
  githubUrl?: string
  twitterUrl?: string
  copyRight?: string
  logo?: ReactNode
}) {
  const socials = [
    ...(twitterUrl
      ? [{ title: "Twitter / X", href: twitterUrl, icon: RiTwitterXFill }]
      : []),
    ...(githubUrl
      ? [{ title: "GitHub", href: githubUrl, icon: FaGithub }]
      : []),
  ]
  return (
    <footer
      className={cn(
        "border-t bg-background px-4 py-2 transition-[padding] duration-200 ease-linear"
      )}
    >
      <div className="max-w-container mx-auto w-full divide-y">
        <div className="flex flex-col items-center justify-between gap-4 px-2 pt-3 pb-5 sm:flex-row">
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-normal">
            {logo ?? <NavLogo />}

            <ul className="flex items-center gap-4 sm:hidden">
              {socials.map(({ title, href, icon: Icon }) => (
                <li key={title}>
                  <Link href={href} aria-label={title}>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
            {links.map(({ title, href }) => (
              <li key={title}>
                <Link href={href}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col-reverse items-center justify-between gap-4 px-2 pt-4 pb-2 sm:flex-row">
          <p className="text-sm font-medium text-muted-foreground">
            {copyRight ??
              `Copyright © ${new Date().getFullYear()} Nox Docs. All rights reserved.`}
          </p>

          <ul className="hidden items-center gap-4 sm:flex">
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
    </footer>
  )
}
