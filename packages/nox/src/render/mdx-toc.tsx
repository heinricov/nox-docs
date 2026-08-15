import React from "react"
import { cn } from "@nox/core/lib/utils"

export type MdxSection = { id: string; title: string }

export function MdxToc({ sections }: { sections: MdxSection[] }) {
  return (
    <aside className="sticky top-34 hidden max-h-[calc(100svh-var(--header-height))] w-52 shrink-0 self-start overflow-y-auto lg:block">
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        On This Page
      </p>
      <nav className="flex flex-col border-l border-border">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "-ml-px border-l py-1.5 pl-4 text-sm transition-colors",
              "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {section.title}
          </a>
        ))}
      </nav>
    </aside>
  )
}
