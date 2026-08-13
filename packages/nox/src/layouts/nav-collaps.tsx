"use client"

import type { ReactNode } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@nox/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@nox/components/sidebar"
import { ChevronRightIcon } from "lucide-react"

/**
 * Komponen navigasi sidebar dengan item yang bisa dicollapse (expandable).
 * Setiap item dapat memiliki sub-menu. Mendukung label grup kustom seperti NavMain.
 */
export function NavCollaps({
  label,
  items,
}: {
  /**
   * Label grup menu yang ditampilkan di atas daftar item.
   * Gunakan `null` untuk menyembunyikan label.
   * @default "Platform"
   */
  label?: string | null
  /**
   * Daftar item navigasi collapsible dengan icon dan sub-item opsional.
   */
  items: {
    title: string
    url: string
    icon: ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      {label !== null ? (
        <SidebarGroupLabel>{label ?? "Platform"}</SidebarGroupLabel>
      ) : null}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            render={<SidebarMenuItem />}
          >
            <SidebarMenuButton
              tooltip={item.title}
              render={<a href={item.url} />}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
            {item.items?.length ? (
              <>
                <SidebarMenuAction
                  render={<CollapsibleTrigger />}
                  className="aria-expanded:rotate-90"
                >
                  <ChevronRightIcon />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton render={<a href={subItem.url} />}>
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : null}
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
