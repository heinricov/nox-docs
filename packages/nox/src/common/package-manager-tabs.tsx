"use client"

import * as React from "react"
import { Check, ChevronDown, Clipboard, Terminal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/dropdown-menu"
import { cn } from "../lib/utils"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"]

const managerIcons: Record<PackageManager, string> = {
  npm: "📦",
  pnpm: "pnpm",
  yarn: "🧶",
  bun: "🥟",
}

function formatCommand(input: string, manager: PackageManager) {
  const command = input.trim()
  const isInit = /(^|\s)init(\s|$)/.test(command)
  const isPackageExec = /^\S+@\S+/.test(command)

  if (isInit || isPackageExec) {
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

function CopyButton({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false)

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
    }
  }

  return (
    <button
      type="button"
      onClick={copyCommand}
      aria-label={copied ? "Copied to clipboard" : "Copy command"}
      className={cn(
        "group relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
        copied
          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-200",
          copied ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}
      >
        <Check aria-hidden="true" className="size-4" />
      </span>
      <span
        className={cn(
          "flex items-center justify-center transition-all duration-200",
          copied ? "scale-75 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Clipboard aria-hidden="true" className="size-4" />
      </span>
    </button>
  )
}

const RUNNERS = [
  "npx",
  "pnpm dlx",
  "yarn dlx",
  "bunx --bun",
  "npm install",
  "pnpm add",
  "yarn add",
  "bun add",
]

function parseCommand(command: string) {
  const parts: {
    text: string
    type: "runner" | "package" | "flag" | "value" | "default"
  }[] = []
  const tokens = command.split(/(\s+)/)
  let i = 0

  const joinedRunners = RUNNERS.map((r) => r.split(/\s+/))

  for (const jr of joinedRunners) {
    let ti = i
    let matched = true
    let consumed = 0

    for (const part of jr) {
      while (ti < tokens.length && /^\s+$/.test(tokens[ti]!)) {
        consumed++
        ti++
      }
      if (ti >= tokens.length || tokens[ti]! !== part) {
        matched = false
        break
      }
      consumed++
      ti++
    }

    if (matched) {
      for (let j = 0; j < consumed; j++) {
        parts.push({ text: tokens[i]!, type: "runner" })
        i++
      }
      break
    }

    parts.length = 0
    i = 0
  }

  while (i < tokens.length) {
    const token = tokens[i]!
    if (/^\s+$/.test(token)) {
      parts.push({ text: token, type: "default" })
      i++
      continue
    }

    if (/^--?\S+$/.test(token)) {
      parts.push({ text: token, type: "flag" })
      i++
      continue
    }

    if (/^\S+@\S+$/.test(token)) {
      parts.push({ text: token, type: "package" })
      i++
      continue
    }

    parts.push({ text: token, type: "default" })
    i++
  }

  return parts
}

function ColorizedCommand({ command }: { command: string }) {
  const parts = parseCommand(command)

  return (
    <>
      {parts.map((part, i) => {
        switch (part.type) {
          case "runner":
            return (
              <span key={i} className="text-muted-foreground/70">
                {part.text}
              </span>
            )
          case "package":
            return (
              <span
                key={i}
                className="font-medium text-cyan-600 dark:text-cyan-400"
              >
                {part.text}
              </span>
            )
          case "flag":
            return (
              <span key={i} className="text-amber-600 dark:text-amber-400">
                {part.text}
              </span>
            )
          default:
            return <span key={i}>{part.text}</span>
        }
      })}
    </>
  )
}

export function PackageManagerTabs({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const rawInput =
    typeof children === "string" ? children : String(children ?? "")
  const [manager, setManager] = React.useState<PackageManager>("npm")

  const commands = rawInput
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => formatCommand(line, manager))

  const allCommands = commands.join("\n")

  return (
    <div
      className={cn(
        "group w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-3 py-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-md bg-muted/60 p-1.5">
            <Terminal
              aria-hidden="true"
              className="size-3.5 text-muted-foreground"
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Terminal
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Package Manager Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Package manager: ${manager}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/50 px-3 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-border hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              <span className="hidden sm:inline">{manager}</span>
              <span className="sm:hidden">{manager.slice(0, 2)}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 text-muted-foreground"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32 p-1">
              <DropdownMenuGroup>
                {packageManagers.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setManager(option)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm",
                      manager === option && "bg-accent/50"
                    )}
                  >
                    <span className="flex-1 font-medium">{option}</span>
                    {manager === option && (
                      <Check
                        aria-hidden="true"
                        className="size-4 text-primary"
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="h-5 w-px bg-border/60" />

          {/* Copy Button */}
          <CopyButton command={allCommands} />
        </div>
      </div>

      {/* Command Display */}
      <div className="relative bg-background">
        <pre className="overflow-x-auto px-4 py-3.5 sm:px-5 sm:py-4">
          <code className="font-mono text-sm leading-relaxed text-foreground/90">
            {commands.map((cmd, i) => (
              <React.Fragment key={i}>
                {i > 0 && "\n"}
                <span className="text-muted-foreground/50 select-none">$ </span>
                <ColorizedCommand command={cmd} />
              </React.Fragment>
            ))}
          </code>
        </pre>

        {/* Gradient fade for long commands */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity group-hover:opacity-100 sm:hidden" />
      </div>
    </div>
  )
}

export default PackageManagerTabs
