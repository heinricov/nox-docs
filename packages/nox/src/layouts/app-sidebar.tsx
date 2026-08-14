"use client"

import * as React from "react"

import { NavCollaps } from "@nox/layouts/nav-collaps"
import { NavMain } from "@nox/layouts/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@nox/components/sidebar"

import { GroupSwitcher } from "@nox/layouts/group-switcher"
import { NavLogo } from "@nox/layouts/nav-logo"

import type { SidebarMenu } from "@nox/layouts/sidebar"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  menu: SidebarMenu[]
}

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
}
export function AppSidebar({ menu, ...props }: AppSidebarProps) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! pl-4"
      {...props}
    >
      <SidebarHeader>
        {/* <GroupSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0] || ""}
        /> */}
      </SidebarHeader>

      <SidebarContent>
        {menu.map((item, index) => {
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
                <div key={`${item.type}-${item.label}-${index}`} className="md:hidden">
                  <NavMain
                    label={item.label}
                    items={item.items}
                  />
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
        <NavLogo className="rounded-md border sm:hidden" />
      </SidebarFooter>
    </Sidebar>
  )
}
