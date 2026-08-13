"use client"

import * as React from "react"
import { useServerInsertedHTML } from "next/navigation"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

const THEME_KEY = "theme"
const THEMES: readonly Theme[] = ["light", "dark", "system"]

const INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}")||"system";var s=t==="system";var r=s?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;var e=document.documentElement;e.classList.remove("light","dark");e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`

function systemTheme(): ResolvedTheme {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? systemTheme() : theme
}

function applyToDocument(theme: ResolvedTheme) {
  const el = document.documentElement
  el.classList.remove("light", "dark")
  el.classList.add(theme)
  el.style.colorScheme = theme
}

let currentTheme: Theme = "system"
let currentResolved: ResolvedTheme = "light"
let freezeTransitions = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function freezeThemeTransitions() {
  const style = document.createElement("style")
  style.textContent = "*{transition:none!important}"
  document.head.appendChild(style)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => style.remove())
  })
}

function changeTheme(theme: Theme) {
  currentTheme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {}
  currentResolved = resolveTheme(theme)
  if (freezeTransitions) freezeThemeTransitions()
  applyToDocument(currentResolved)
  emit()
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = true,
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  disableTransitionOnChange?: boolean
}) {
  useServerInsertedHTML(() =>
    React.createElement("script", {
      dangerouslySetInnerHTML: { __html: INIT_SCRIPT },
    })
  )

  React.useEffect(() => {
    freezeTransitions = disableTransitionOnChange

    let stored: Theme = defaultTheme
    try {
      const value = localStorage.getItem(THEME_KEY)
      if (value && (THEMES as readonly string[]).includes(value)) {
        stored = value as Theme
      }
    } catch {}

    currentTheme = stored
    currentResolved = resolveTheme(stored)
    applyToDocument(currentResolved)
    emit()

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onMediaChange = () => {
      if (currentTheme !== "system") return
      currentResolved = resolveTheme("system")
      if (freezeTransitions) freezeThemeTransitions()
      applyToDocument(currentResolved)
      emit()
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY || !event.newValue) return
      if (!(THEMES as readonly string[]).includes(event.newValue)) return
      changeTheme(event.newValue as Theme)
    }

    media.addEventListener("change", onMediaChange)
    window.addEventListener("storage", onStorage)
    return () => {
      media.removeEventListener("change", onMediaChange)
      window.removeEventListener("storage", onStorage)
    }
  }, [defaultTheme, disableTransitionOnChange])

  return React.createElement(React.Fragment, null, children)
}

function useTheme() {
  const theme = React.useSyncExternalStore(
    subscribe,
    () => currentTheme,
    () => "system"
  )
  const resolvedTheme = React.useSyncExternalStore(
    subscribe,
    () => currentResolved,
    () => "light"
  )

  return {
    theme,
    resolvedTheme,
    setTheme: changeTheme,
  }
}

export { ThemeProvider, useTheme }
export type { Theme, ResolvedTheme }