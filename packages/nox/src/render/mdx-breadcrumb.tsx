import React from "react"
import { RiArrowRightSLine } from "react-icons/ri"

export function MdxBreadcrumb({ items }: { items?: string[] }) {
  const crumbs = items ?? ["Docs", "Getting Started"]

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {crumbs.map((crumb, i) => (
          <li key={crumb} className="flex items-center gap-1.5">
            {i > 0 && (
              <RiArrowRightSLine
                className="size-3.5 text-muted-foreground/50"
                aria-hidden="true"
              />
            )}
            <span
              className={
                i === crumbs.length - 1 ? "font-medium text-foreground" : ""
              }
            >
              {crumb}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
