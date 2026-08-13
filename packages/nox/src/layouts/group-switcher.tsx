"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@nox/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@nox/components/sidebar"

export function GroupSwitcher({
  versions,
  defaultVersion,
}: {
  versions: string[]
  defaultVersion: string
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

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
              <span className="">v{selectedVersion}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-(--anchor-width)"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
