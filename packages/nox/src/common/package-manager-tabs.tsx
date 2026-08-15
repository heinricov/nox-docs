"use client"

import * as React from "react"
import { Check, ChevronDown, Clipboard, Terminal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nox/core/components/dropdown-menu"
import { cn } from "@nox/core/lib/utils"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"]

function formatCommand(input: string, manager: PackageManager) {
  const command = input.trim()
  const isInit = /(^|\s)init(\s|$)/.test(command)

  if (isInit) {
    const runner = {
      npm: "npx",
      pnpm: "pnpm dlx",
      yarn: "yarn dlx",
      bun: "bunx --bun",
    }[manager]
    return `${runner} ${command}`
  }

  const install = {
    npm: "npm install",
    pnpm: "pnpm add",
    yarn: "yarn add",
    bun: "bun add",
  }[manager]
  return `${install} ${command}`
}

export function PackageManagerTabs({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const rawCommand =
    typeof children === "string" ? children : String(children ?? "")
  const [manager, setManager] = React.useState<PackageManager>("npm")
  const [copied, setCopied] = React.useState(false)
  const command = formatCommand(rawCommand, manager)

  async function copyCommand() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-border bg-muted/40 px-3 py-0 sm:px-4">
        <Terminal aria-hidden="true" className="size-4 text-muted-foreground" />
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Package manager: ${manager}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-lg font-medium text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {manager}
              <ChevronDown aria-hidden="true" className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-28">
              <DropdownMenuGroup>
                {packageManagers.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setManager(option)}
                  >
                    <span className="flex-1">{option}</span>
                    {manager === option && <Check aria-hidden="true" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={copyCommand}
            aria-label={copied ? "Command copied" : "Copy command"}
            title={copied ? "Copied" : "Copy command"}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? (
              <Check aria-hidden="true" className="size-5" />
            ) : (
              <Clipboard aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-foreground">
        <code>{command}</code>
      </pre>
    </div>
  )
}

export default PackageManagerTabs
