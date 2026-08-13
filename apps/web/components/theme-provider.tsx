"use client"

import * as React from "react"
import { ThemeProvider as NoxThemeProvider, useTheme } from "@nox/lib/theme"

function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: "light" | "dark" | "system"
  disableTransitionOnChange?: boolean
}) {
  return (
    <NoxThemeProvider
      defaultTheme="system"
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NoxThemeProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }