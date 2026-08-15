"use client"

import { Children, isValidElement, useEffect, useMemo, useState } from "react"
import { Check, Copy, FileCode2, Minus, Plus } from "lucide-react"
import { cn } from "@nox/core/lib/utils"
import {
  cleanCode,
  getLanguageFromFilename,
  nodeToText,
} from "@nox/core/lib/code-notation"
import { formatCode } from "@nox/core/lib/code-format"

type CodeBlockProps = { children?: React.ReactNode; filename?: string }
type CodeDiffProps = {
  children?: React.ReactNode
  filename?: string
  title?: string
  inline?: boolean
}
type ParsedSection = { type: "old" | "new"; filename?: string; code: string }

function Section({ children }: CodeBlockProps) {
  return <>{children}</>
}

export function CodeDiff({
  children,
  filename,
  title,
  inline = false,
}: CodeDiffProps) {
  const rawSections: ParsedSection[] = useMemo(
    () =>
      Children.toArray(children).flatMap((node, index) => {
        if (!isValidElement<CodeBlockProps>(node)) return []
        const element = node
        const props = element.props
        const componentType = element.type as {
          kind?: string
          displayName?: string
          name?: string
        }
        const label =
          componentType.kind || componentType.displayName || componentType.name
        const kind =
          componentType === OldCode || label === "OldCode" || label === "old"
            ? "old"
            : componentType === NewCode ||
                label === "NewCode" ||
                label === "new"
              ? "new"
              : componentType === OldFile ||
                  label === "OldFile" ||
                  label === "old-file"
                ? "old-file"
                : componentType === NewFile ||
                    label === "NewFile" ||
                    label === "new-file"
                  ? "new-file"
                  : index === 0
                    ? "old"
                    : index === 1
                      ? "new"
                      : undefined
        const type =
          kind === "old-file"
            ? "old"
            : kind === "new-file"
              ? "new"
              : (kind as ParsedSection["type"])
        return kind
          ? [
              {
                type,
                filename: props.filename,
                code: cleanCode(nodeToText(props.children)),
              },
            ]
          : []
      }),
    [children]
  )
  const [sections, setSections] = useState(rawSections)

  useEffect(() => {
    let active = true
    Promise.all(
      rawSections.map(async (section) => {
        const language = section.filename
          ? getLanguageFromFilename(section.filename)
          : "code"
        const code = await formatCode(section.code, language)
        return { ...section, code }
      })
    ).then((formatted) => {
      if (active) setSections(formatted)
    })
    return () => {
      active = false
    }
  }, [rawSections])
  const nodes = Children.toArray(children)
  const hasFileChange = nodes.some((node) => {
    if (!node || typeof node !== "object" || !("type" in node)) return false
    if (!isValidElement(node)) return false
    const componentType = node.type as {
      kind?: string
      displayName?: string
      name?: string
    }
    const label =
      componentType.kind || componentType.displayName || componentType.name
    return (
      node.type === OldFile ||
      node.type === NewFile ||
      label === "OldFile" ||
      label === "NewFile" ||
      label === "old-file" ||
      label === "new-file"
    )
  })
  return (
    <CodeDiffView
      sections={sections}
      filename={filename}
      title={title}
      inline={inline && !hasFileChange}
    />
  )
}

function CodeDiffView({
  sections,
  filename,
  title,
  inline = false,
}: {
  sections: ParsedSection[]
  filename?: string
  title?: string
  inline?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const oldSection = sections.find((section) => section.type === "old")
  const newSection = sections.find((section) => section.type === "new")
  const copyText = newSection?.code || oldSection?.code || ""

  async function copyCode() {
    await navigator.clipboard.writeText(copyText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section
      className="not-prose overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm"
      aria-label={title || "Code diff"}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileCode2
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate text-sm font-medium">
            {title ||
              filename ||
              oldSection?.filename ||
              newSection?.filename ||
              "Code changes"}
          </span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Copy new code"
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      {inline ? (
        <InlineDiff oldSection={oldSection} newSection={newSection} />
      ) : (
        <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
          {([oldSection, newSection] as const).map(
            (section) =>
              section && (
                <DiffPane
                  key={section.type}
                  section={section}
                  counterpart={section.type === "old" ? newSection : oldSection}
                />
              )
          )}
        </div>
      )}
    </section>
  )
}

function InlineDiff({
  oldSection,
  newSection,
}: {
  oldSection?: ParsedSection
  newSection?: ParsedSection
}) {
  const oldLines = oldSection?.code.split("\n") ?? []
  const newLines = newSection?.code.split("\n") ?? []
  const rows = Math.max(oldLines.length, newLines.length)
  return (
    <pre className="overflow-x-auto bg-background py-2 font-mono text-[13px] leading-6">
      <code>
        {Array.from({ length: rows }, (_, index) => {
          const oldLine = oldLines[index] ?? ""
          const newLine = newLines[index] ?? ""
          const changed = oldLine !== newLine
          return (
            <span key={index} className="block min-w-max">
              {changed && oldLine && (
                <span className="flex border-l-2 border-rose-500 bg-rose-500/20 px-4 font-medium text-rose-900 dark:text-rose-100">
                  <span className="mr-4 inline-block w-6 text-right text-rose-700 select-none dark:text-rose-300">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre">
                    <Minus
                      className="mr-2 inline-block size-3.5 align-[-2px]"
                      aria-hidden="true"
                    />
                    {oldLine}
                  </span>
                </span>
              )}
              {changed && newLine && (
                <span className="flex border-l-2 border-emerald-500 bg-emerald-500/20 px-4 font-medium text-emerald-900 dark:text-emerald-100">
                  <span className="mr-4 inline-block w-6 text-right text-emerald-700 select-none dark:text-emerald-300">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre">
                    <Plus
                      className="mr-2 inline-block size-3.5 align-[-2px]"
                      aria-hidden="true"
                    />
                    {newLine}
                  </span>
                </span>
              )}
              {!changed && (
                <span className="flex min-w-max px-4 text-foreground">
                  <span className="mr-4 inline-block w-6 text-right text-muted-foreground/60 select-none">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre">{oldLine || " "}</span>
                </span>
              )}
            </span>
          )
        })}
      </code>
    </pre>
  )
}

function DiffPane({
  section,
  counterpart,
}: {
  section: ParsedSection
  counterpart?: ParsedSection
}) {
  const lines = section.code ? section.code.split("\n") : [""]
  const counterpartLines = counterpart?.code ? counterpart.code.split("\n") : []
  const isNew = section.type === "new"
  return (
    <div className="min-w-0">
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border px-4 py-2 text-xs font-semibold",
          isNew
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
        )}
      >
        {isNew ? (
          <Plus className="size-3.5" aria-hidden="true" />
        ) : (
          <Minus className="size-3.5" aria-hidden="true" />
        )}
        <span>{isNew ? "New" : "Old"}</span>
        {section.filename && (
          <span className="truncate font-mono font-normal opacity-80">
            {section.filename}
          </span>
        )}
      </div>
      <pre className="overflow-x-auto bg-background py-2 text-[13px] leading-6">
        <code>
          {lines.map((line, index) => {
            const changed = line !== counterpartLines[index]
            return (
              <span
                key={`${section.type}-${index}`}
                className={cn(
                  "flex min-w-max border-l-2 px-4",
                  changed
                    ? isNew
                      ? "border-emerald-500 bg-emerald-500/20"
                      : "border-rose-500 bg-rose-500/20"
                    : "border-transparent",
                  changed && "font-medium"
                )}
              >
                <span
                  className={cn(
                    "mr-4 inline-block w-6 text-right select-none",
                    changed
                      ? isNew
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-rose-700 dark:text-rose-300"
                      : "text-muted-foreground/60"
                  )}
                >
                  {index + 1}
                </span>
                <span className="whitespace-pre">{line || " "}</span>
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}

export function OldCode({ children, filename }: CodeBlockProps) {
  return <Section filename={filename}>{children}</Section>
}
;(OldCode as typeof OldCode & { kind: "old"; displayName: string }).kind = "old"
OldCode.displayName = "old"

export function NewCode({ children, filename }: CodeBlockProps) {
  return <Section filename={filename}>{children}</Section>
}
;(NewCode as typeof NewCode & { kind: "new"; displayName: string }).kind = "new"
NewCode.displayName = "new"

export function OldFile({ children, filename }: CodeBlockProps) {
  return <Section filename={filename}>{children}</Section>
}
;(OldFile as typeof OldFile & { kind: "old-file"; displayName: string }).kind =
  "old-file"
OldFile.displayName = "old-file"

export function NewFile({ children, filename }: CodeBlockProps) {
  return <Section filename={filename}>{children}</Section>
}
;(NewFile as typeof NewFile & { kind: "new-file"; displayName: string }).kind =
  "new-file"
NewFile.displayName = "new-file"

export default CodeDiff
