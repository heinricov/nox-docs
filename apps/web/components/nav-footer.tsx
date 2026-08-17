"use client"

import Link from "next/link"

import { cn } from "nox/lib/utils"
import { NavLogo } from "nox"
import { RiTwitterXFill } from "react-icons/ri"
import { FaGithub } from "react-icons/fa"

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

const socials = [
  { title: "Twitter / X", href: "/", icon: RiTwitterXFill },
  { title: "GitHub", href: "/", icon: FaGithub },
]

export function NavFooter() {
  return (
    <footer
      className={cn(
        "border-t bg-background px-4 py-2 transition-[padding] duration-200 ease-linear"
      )}
    >
      <div className="max-w-container mx-auto w-full divide-y">
        <div className="flex flex-col items-center justify-between gap-4 px-2 pt-3 pb-5 sm:flex-row">
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-normal">
            <NavLogo />

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
            Copyright &copy; {new Date().getFullYear()} Bloxxee. All rights
            reserved.
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
