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
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  Home,
  Settings,
} from "lucide-react"
import { GroupSwitcher } from "@nox/layouts/group-switcher"
import { NavLogo } from "@nox/layouts/nav-logo"

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: {
    label: "Platform",
    items: [
      {
        title: "Playground",
        url: "#",
        icon: <TerminalSquareIcon />,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: <BotIcon />,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: <BookOpenIcon />,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: <Settings2Icon />,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
  },
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
  menus: {
    items: [
      {
        title: "Home",
        url: "/",
        icon: <Home />,
      },
      {
        title: "Documentation",
        url: "/docs",
        icon: <BookOpenIcon />,
      },
      {
        title: "Contact",
        url: "/contact",
        icon: <SendIcon />,
      },
    ],
  },
  docsMenus: {
    label: "Documentation",
    items: [
      {
        title: "Home",
        url: "/",
        icon: <Home />,
      },
      {
        title: "Installation",
        url: "/docs/installation/",
        icon: <Settings />,
      },
      {
        title: "Travel",
        url: "#",
        icon: <MapIcon />,
      },
    ],
  },
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <GroupSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0] || ""}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.menus.items} />
        <NavMain label={data.docsMenus.label} items={data.docsMenus.items} />
        <NavCollaps label={data.navMain.label} items={data.navMain.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavLogo className="rounded-md border sm:hidden" />
      </SidebarFooter>
    </Sidebar>
  )
}
