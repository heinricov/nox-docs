"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@nox/core/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@nox/core/components/sidebar"

export type GroupMenuItem = {
  title: string
  icon: React.ReactNode
  description: string
}

export type NavGroupProps = {
  groupmenu: GroupMenuItem[]
  defaultVersion: string
  value?: string
  onValueChange?: (value: string) => void
}

export function NavGroup({
  groupmenu,
  defaultVersion,
  value,
  onValueChange,
}: NavGroupProps) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)
  const activeVersion = value ?? selectedVersion
  const selected = groupmenu.find((item) => item.title === activeVersion)

  const handleSelect = (title: string) => {
    setSelectedVersion(title)
    onValueChange?.(title)
  }

  return (
    <SidebarMenu className="w-full rounded-md border">
      <SidebarMenuItem className="w-full">
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            render={<MenuPrimitive.Trigger className="w-full" />}
            className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Documentation</span>
              <span className="">{selected?.title || activeVersion}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-(--anchor-width)"
            align="start"
          >
            {groupmenu.map((item) => (
              <DropdownMenuItem
                key={item.title}
                onClick={() => handleSelect(item.title)}
                className="mt-1 flex items-center gap-3 border-primary px-4 py-1 hover:border"
              >
                {item.icon}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                  <span className="text-sm/relaxed font-medium">
                    {item.title}
                  </span>
                  <span className="block truncate text-muted-foreground">
                    {item.description}
                  </span>
                </div>
                {item.title === activeVersion && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
