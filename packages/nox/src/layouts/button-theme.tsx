"use client"

import { Button } from "@nox/components/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ButtonTheme() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent SSR flicker and hydration mismatch
  if (!mounted) {
    return <Button variant="ghost" className="rounded-full" size="icon" />
  }

  return (
    <Button
      variant="ghost"
      className="rounded-full"
      onClick={toggleTheme}
      size="icon"
    >
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
