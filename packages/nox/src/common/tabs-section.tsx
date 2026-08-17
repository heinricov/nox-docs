"use client"

import { Children, isValidElement, useState, type ReactNode } from "react"
import { cn } from "../lib/utils"

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

interface TabsSectionProps {
  children: ReactNode
  defaultValue?: string
  className?: string
}

interface TabsContentProps {
  value: string
  tabLabel?: string
  children?: ReactNode
  className?: string
}

interface TabsContentChildProps {
  value: string
  tabLabel?: string
  children?: ReactNode
}

function TabsContent({ children, className }: TabsContentProps) {
  return <div className={cn(className)}>{children}</div>
}

export function TabsSection({
  children,
  defaultValue,
  className,
}: TabsSectionProps) {
  const tabs: { value: string; label: string }[] = []

  Children.forEach(children, (child) => {
    if (isValidElement<TabsContentChildProps>(child) && child.props.value) {
      tabs.push({
        value: child.props.value,
        label: child.props.tabLabel ?? capitalize(child.props.value),
      })
    }
  })

  const [activeTab, setActiveTab] = useState(defaultValue ?? tabs[0]?.value)

  const activeChild = Children.toArray(children).find((child) => {
    if (!isValidElement<TabsContentChildProps>(child)) return false
    return child.props.value === activeTab
  })

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        className="flex items-end gap-0 overflow-x-auto scrollbar-none border-b"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-4 sm:text-sm",
              activeTab === tab.value
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{activeChild ?? null}</div>
    </div>
  )
}

export { TabsContent }
