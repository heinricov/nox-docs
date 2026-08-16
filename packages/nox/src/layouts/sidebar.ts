import type { ReactNode } from "react"

export type NavMainItem = {
  title: string
  url: string
  icon?: ReactNode
  group?: string
}

export type NavCollapsItem = {
  title: string
  url: string
  icon?: ReactNode
  isActive?: boolean
  group?: string
  items?: {
    title: string
    url: string
  }[]
}

export type NavMainMenu = {
  type: "main"
  label?: string
  group?: string
  items: NavMainItem[]
}

export type NavMainMobileMenu = {
  type: "main-mobile"
  label?: string
  group?: string
  items: NavMainItem[]
}

export type NavCollapsMenu = {
  type: "collaps"
  label?: string
  group?: string
  items: NavCollapsItem[]
}

export type NoxSidebarMenu = NavMainMenu | NavMainMobileMenu | NavCollapsMenu
