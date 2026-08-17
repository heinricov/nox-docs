"use client"

import { cn } from "../lib/utils"
import { useEffect, useMemo, useState } from "react"

type ProcessAnimation = "progressBar" | "ProgresBar" | "spinner" | "none"
type Status = "command" | "success" | "question" | "error" | "info" | "active"

const statusGlyph: Record<Status, string> = {
  command: "❯",
  success: "◆",
  question: "◇",
  error: "■",
  info: "●",
  active: "◇",
}

export function TerminalView({
  children,
  title = "terminal",
  className,
}: {
  children: React.ReactNode
  title?: string
  className?: string
}) {
  return (
    <section
      className={cn(
        "terminal-view border-terminal-border bg-terminal text-terminal-foreground overflow-hidden border shadow-2xl",
        className
      )}
      aria-label={`${title} terminal preview`}
    >
      <div className="border-terminal-border text-terminal-muted flex items-center gap-2 border-b px-4 py-3 text-xs">
        <span
          className="bg-terminal-cyan size-2 rounded-full"
          aria-hidden="true"
        />
        <span
          className="bg-terminal-blue size-2 rounded-full"
          aria-hidden="true"
        />
        <span
          className="bg-terminal-green size-2 rounded-full"
          aria-hidden="true"
        />
        <span className="ml-2">{title}</span>
      </div>
      <div className="terminal-scroll flex min-w-0 flex-col gap-4 overflow-x-auto p-5 font-mono text-[13px] leading-[1.45] sm:p-7 sm:text-sm">
        {children}
      </div>
    </section>
  )
}

export function AsciiArt({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <pre
      className={cn(
        "terminal-ascii text-terminal-cyan whitespace-pre",
        className
      )}
      aria-label="ASCII art"
    >
      {children}
    </pre>
  )
}

export function Command({
  children,
  status = "command",
  className,
}: {
  children: React.ReactNode
  status?: Status
  className?: string
}) {
  return (
    <div className="flex min-w-max items-start gap-2">
      <span
        className={cn("terminal-glyph", `terminal-${status}`)}
        aria-hidden="true"
      >
        {statusGlyph[status]}
      </span>
      <code className={cn("text-terminal-foreground", className)}>
        {children}
      </code>
    </div>
  )
}

export function ResultsProcess({
  children,
  status = "active",
  className,
}: {
  children: React.ReactNode
  status?: Status
  className?: string
}) {
  return (
    <div
      className={cn(
        "terminal-result border-terminal-line relative ml-1 flex flex-col gap-3 border-l pl-6",
        status === "error" && "border-terminal-red",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Question({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-terminal-foreground flex items-start gap-3">
      <span className="terminal-glyph terminal-question" aria-hidden="true">
        {statusGlyph.question}
      </span>
      <span>{children}</span>
    </div>
  )
}

export function Option({
  children,
  selected = false,
  description,
}: {
  children: React.ReactNode
  selected?: boolean
  description?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex min-w-max items-baseline gap-2 pl-1",
        selected ? "text-terminal-foreground" : "text-terminal-muted"
      )}
    >
      <span
        className={cn("terminal-option", selected && "terminal-selected")}
        aria-hidden="true"
      >
        {selected ? "▣" : "□"}
      </span>
      <span>{children}</span>
      {description && (
        <span className="text-terminal-muted">({description})</span>
      )}
    </div>
  )
}

export function Prompt({
  children,
  color = "cyan",
}: {
  children: React.ReactNode
  color?: "cyan" | "green" | "red" | "blue"
}) {
  return (
    <div className={cn("flex gap-2", `terminal-${color}`)}>
      <span aria-hidden="true">›</span>
      <span>{children}</span>
    </div>
  )
}

export function Done({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-terminal-green flex items-center gap-3"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">✔</span>
      <span>{children}</span>
    </div>
  )
}

export function Cancelled({
  children = "Cancelled.",
}: {
  children?: React.ReactNode
}) {
  return (
    <div
      className="text-terminal-red flex items-center gap-3"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">■</span>
      <span>{children}</span>
    </div>
  )
}

export function Process({
  duration = 3,
  animation = "progressBar",
  label = "Processing",
}: {
  duration?: number
  animation?: ProcessAnimation
  label?: string
}) {
  const [progress, setProgress] = useState(0)
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  )
  const seconds = Math.max(0.5, duration)

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100)
      return
    }
    const started = Date.now()
    const timer = window.setInterval(() => {
      const next = Math.min(
        100,
        ((Date.now() - started) / (seconds * 1000)) * 100
      )
      setProgress(next)
      if (next >= 100) window.clearInterval(timer)
    }, 80)
    return () => window.clearInterval(timer)
  }, [reducedMotion, seconds])

  if (animation === "none") return null
  return (
    <div
      className="text-terminal-muted flex min-w-65 flex-col gap-1"
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${Math.round(progress)} percent`}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "terminal-glyph terminal-active",
            progress < 100 && "animate-pulse"
          )}
          aria-hidden="true"
        >
          ◇
        </span>
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(progress)}%</span>
      </div>
      {(animation === "progressBar" || animation === "ProgresBar") && (
        <div className="bg-terminal-line h-1 overflow-hidden">
          <div
            className="bg-terminal-cyan h-full transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function TerminalStep({
  children,
  status = "info",
}: {
  children: React.ReactNode
  status?: Status
}) {
  return (
    <div className={cn("flex items-start gap-3", `terminal-${status}`)}>
      <span className="terminal-glyph" aria-hidden="true">
        {statusGlyph[status]}
      </span>
      <span>{children}</span>
    </div>
  )
}

export type { ProcessAnimation, Status }
export const Comman = Command
export const ProgressBar = Process
export const ProgresBar = Process
export default TerminalView
