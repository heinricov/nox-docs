"use client"

import Link from "next/link"

import { RiTwitterXFill } from "react-icons/ri"
import { FaGithub } from "react-icons/fa"
import { cn } from "@nox/lib/utils"
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

export function AppFooter() {
  return (
    <footer
      className={cn(
        "border-t bg-background px-4 py-2 transition-[padding] duration-200 ease-linear"
      )}
    >
      <div className="max-w-container mx-auto w-full divide-y">
        <div className="flex flex-col items-center justify-between gap-4 px-2 pt-3 pb-5 sm:flex-row">
          <NavLogo />

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
            Copyright &copy; {new Date().getFullYear()} Bloxxee. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/">
              <RiTwitterXFill className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/">
              <FaGithub className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
