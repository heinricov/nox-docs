"use client"

import * as React from "react"

import { NavCollaps } from "./nav-collaps"
import { NavMain } from "./nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../components/sidebar"

import { NavGroup } from "./nav-group"
import type { GroupMenuItem } from "./nav-group"

import type { NavCollapsItem, NavMainItem, NoxSidebarMenu } from "./"
import { SideLogo } from "./side-logo"

type DefaultSidebarProps = React.ComponentProps<typeof Sidebar> & {
  menu: NoxSidebarMenu[]
  groupmenu?: GroupMenuItem[]
}

type GroupableItem = NavMainItem | NavCollapsItem

function filterMenuItems<T extends GroupableItem>(
  items: T[],
  group: string | undefined,
  activeGroup: string
): T[] {
  const hasGroup = Boolean(group) || items.some((item) => item.group)
  if (!hasGroup) return items
  return items.filter((item) => (item.group ?? group) === activeGroup)
}

export function DefaultSidebar({
  menu,
  groupmenu = [],
  ...props
}: DefaultSidebarProps) {
  const [activeGroup, setActiveGroup] = React.useState(
    groupmenu[0]?.title ?? ""
  )

  const filteredMenu = menu
    .map((entry) => ({
      ...entry,
      items: filterMenuItems(entry.items, entry.group, activeGroup),
    }))
    .filter((entry) => entry.items.length > 0)

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! pl-4"
      {...props}
    >
      <SidebarHeader>
        {groupmenu.length > 0 && (
          <NavGroup
            groupmenu={groupmenu}
            defaultVersion={groupmenu[0]?.title || ""}
            value={activeGroup}
            onValueChange={setActiveGroup}
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        {filteredMenu.map((item, index) => {
          switch (item.type) {
            case "main":
              return (
                <NavMain
                  key={`${item.type}-${item.label}-${index}`}
                  label={item.label}
                  items={item.items}
                />
              )

            case "main-mobile":
              return (
                <div
                  key={`${item.type}-${item.label}-${index}`}
                  className="md:hidden"
                >
                  <NavMain label={item.label} items={item.items} />
                </div>
              )

            case "collaps":
              return (
                <NavCollaps
                  key={`${item.type}-${item.label}-${index}`}
                  label={item.label}
                  items={item.items}
                />
              )
          }
        })}
      </SidebarContent>

      <SidebarFooter>
        <SideLogo className="rounded-md border sm:hidden" />
      </SidebarFooter>
    </Sidebar>
  )
}
