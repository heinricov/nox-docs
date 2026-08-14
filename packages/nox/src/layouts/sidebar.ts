import type { ReactNode } from "react"

export type NavMainItem = {
  title: string
  url: string
  icon?: ReactNode
}

export type NavCollapsItem = {
  title: string
  url: string
  icon?: ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export type NavMainMenu = {
  type: "main"
  label?: string
  items: NavMainItem[]
}

export type NavMainMobileMenu = {
  type: "main-mobile"
  label?: string
  items: NavMainItem[]
}

export type NavCollapsMenu = {
  type: "collaps"
  label?: string
  items: NavCollapsItem[]
}

export type SidebarMenu = NavMainMenu | NavMainMobileMenu | NavCollapsMenu
