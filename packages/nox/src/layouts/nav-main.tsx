"use client"

import type { ReactNode } from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@nox/components/sidebar"

export function NavMain({
  label,
  items,
}: {
  /**
   * Label grup menu yang ditampilkan di atas daftar item.
   * @default "Projects"
   */
  label?: string
  /**
   * Daftar item navigasi flat (level tunggal) dengan icon opsional.
   */
  items: {
    title: string
    url: string
    icon?: ReactNode
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {label !== null ? (
        <SidebarGroupLabel>{label ?? "Menus"}</SidebarGroupLabel>
      ) : null}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              render={<a href={item.url} />}
              tooltip={item.title}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
