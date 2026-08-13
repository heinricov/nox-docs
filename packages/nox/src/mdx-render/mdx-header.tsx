import React from "react"
import { MdxCopyPage } from "./mdx-copy-page"

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function MdxHeader({
  title,
  description,
  createdAt,
  updatedAt,
}: {
  title?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}) {
  const created = formatDate(createdAt)
  const updated = formatDate(updatedAt)

  return (
    <div className="gap-2">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {title ?? "Setting up authentication"}
        </h1>
        <MdxCopyPage />
      </div>
      <p className="mt-3 text-muted-foreground">
        {description ??
          "Connect a provider, protect your routes, and read the current session on the server."}
      </p>
      {created || updated ? (
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground tabular-nums">
            {created ? `Created : ${created}` : null}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {updated ? `Last updated ${updated}` : null}
          </p>
        </div>
      ) : null}
    </div>
  )
}
