"use client"

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

import type { NavCollapsItem } from "@nox/layouts/sidebar"

type NavCollapsProps = {
  label?: string | null
  items: NavCollapsItem[]
}

export function NavCollaps({ label, items }: NavCollapsProps) {
  return (
    <SidebarGroup>
      {label !== null ? (
        <SidebarGroupLabel className="text-md">
          {label ?? "Platform"}
        </SidebarGroupLabel>
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
              className="text-xl"
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
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          render={<a href={subItem.url} />}
                          className="text-xl"
                        >
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
