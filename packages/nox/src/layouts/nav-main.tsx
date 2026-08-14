"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@nox/components/sidebar"
import type { NavMainItem } from "@nox/layouts/"

type NavMainProps = {
  label?: string
  items: NavMainItem[]
}

export function NavMain({ label, items }: NavMainProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {label !== null ? (
        <SidebarGroupLabel className="text-md">
          {label ?? "Menus"}
        </SidebarGroupLabel>
      ) : null}

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              render={<a href={item.url} />}
              tooltip={item.title}
              className="text-xl"
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
