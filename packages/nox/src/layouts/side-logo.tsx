"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "../lib/utils"
import { BookText } from "lucide-react"

export function SideLogo({ className }: { className?: string }) {
  const [hasIcon, setHasIcon] = useState(true)

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/60",
        className
      )}
    >
      {hasIcon ? (
        <div className="relative flex size-6 items-center justify-center overflow-hidden">
          <Image
            src="/icon.png"
            alt="Nox"
            fill
            className="object-cover"
            onError={() => setHasIcon(false)}
          />
        </div>
      ) : (
        <div className="relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground">
          <BookText className="size-4" />
        </div>
      )}
      <div className="grid text-left text-sm leading-tight">
        <span className="truncate font-medium">Nox</span>
        <span className="truncate text-xs text-muted-foreground">
          Version 0.0.1
        </span>
      </div>
    </Link>
  )
}
