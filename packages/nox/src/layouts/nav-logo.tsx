import Link from "next/link"
import { cn } from "@nox/lib/utils"
import { TerminalIcon } from "lucide-react"

export function NavLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/60",
        className
      )}
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <TerminalIcon className="size-4" />
      </div>
      <div className="grid text-left text-sm leading-tight">
        <span className="truncate font-medium">Nox</span>
        <span className="truncate text-xs text-muted-foreground">
          Version 0.0.1
        </span>
      </div>
    </Link>
  )
}
