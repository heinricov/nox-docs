"use client"

import { cn } from "../lib/utils"
import { useEffect, useMemo, useState } from "react"

type ProcessAnimation = "progressBar" | "spinner" | "none"

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
        "my-2 overflow-hidden rounded-xl border border-slate-700/50 bg-[#0d1117] text-[#e6edf3] shadow-2xl",
        className
      )}
      aria-label={`${title} terminal preview`}
    >
      <div className="flex items-center gap-2 border-b border-slate-700/50 bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-2 flex-1 truncate text-center text-xs text-slate-400">
          {title}
        </span>
        <div className="w-13" />
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto p-4 font-mono text-[13px] leading-[1.6] sm:p-5 sm:text-sm">
        {children}
      </div>
    </section>
  )
}

export function Command({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="w-4 text-center text-emerald-400" aria-hidden="true">
        ❯
      </span>
      <span className="text-[#e6edf3]">{children}</span>
    </div>
  )
}

export function QuestionStep({
  question,
  done = false,
  children,
  className,
}: {
  question: string
  done?: boolean
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn("w-4 text-center", done ? "text-amber-400" : "text-amber-400/70")}
          aria-hidden="true"
        >
          {done ? "✔" : "?"}
        </span>
        <span className="text-[#e6edf3]">{question}</span>
      </div>
      {children && <div className="ml-6 flex flex-col">{children}</div>}
    </div>
  )
}

export function Option({
  children,
  selected = false,
  description,
  className,
}: {
  children: React.ReactNode
  selected?: boolean
  description?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        selected ? "text-[#e6edf3]" : "text-slate-400",
        className
      )}
    >
      <span
        className={cn(
          "w-4 text-center",
          selected ? "text-cyan-400" : "text-transparent"
        )}
      >
        ❯
      </span>
      <span>{children}</span>
      {description && <span className="text-slate-500">({description})</span>}
    </div>
  )
}

export function SuccessProcess({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="w-4 text-center text-emerald-400" aria-hidden="true">
        ✔
      </span>
      <span className="text-emerald-400">{message}</span>
    </div>
  )
}

export function Result({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="w-4 text-center" aria-hidden="true" />
      <span className="text-slate-400">{message}</span>
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
      className="flex min-w-64 flex-col gap-1 text-slate-400"
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${Math.round(progress)} percent`}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn("w-4 text-center text-cyan-400", progress < 100 && "animate-pulse")}
          aria-hidden="true"
        >
          ◇
        </span>
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(progress)}%</span>
      </div>
      {animation === "progressBar" && (
        <div className="ml-6 h-1 overflow-hidden rounded-full bg-slate-700/50">
          <div
            className="h-full rounded-full bg-linear-to-r from-cyan-500 to-cyan-400 transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export type { ProcessAnimation }
export const ProgressBar = Process
export default TerminalView
