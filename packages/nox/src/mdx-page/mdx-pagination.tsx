import React from "react"
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri"

export type MdxNavLink = { title: string; url: string }

export function MdxPagination({
  previous,
  next,
}: {
  previous?: MdxNavLink
  next?: MdxNavLink
}) {
  return (
    <nav aria-label="Pagination" className="grid gap-3 sm:grid-cols-2">
      <a
        href={previous?.url ?? "#"}
        className="group flex flex-col gap-1 border border-border p-4 transition-colors hover:border-muted-foreground/40"
      >
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <RiArrowLeftLine className="size-3.5" aria-hidden="true" />
          Previous
        </span>
        <span className="text-sm font-medium">
          {previous?.title ?? "Installation"}
        </span>
      </a>
      <a
        href={next?.url ?? "#"}
        className="group flex flex-col items-end gap-1 border border-border p-4 text-right transition-colors hover:border-muted-foreground/40"
      >
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          Next
          <RiArrowRightLine className="size-3.5" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium">
          {next?.title ?? "Managing sessions"}
        </span>
      </a>
    </nav>
  )
}