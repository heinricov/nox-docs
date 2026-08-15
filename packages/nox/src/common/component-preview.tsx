"use client"

import type { ReactElement, ReactNode } from "react"
import { Children, isValidElement, useEffect, useMemo, useState } from "react"
import React from "react"
import elementToJSXString from "react-element-to-jsx-string"
import { cn } from "@nox/core/lib/utils"
import { CodeBlock } from "@nox/core/common/code-block"
import { PackageManagerTabs } from "@nox/core/common/package-manager-tabs"
import { previewRegistry } from "@nox/core/lib/preview-registry"
import {
  findDataLanguage,
  highlightCode,
  nodeToText,
  resolveCodeLanguage,
  resolveLazyNode,
  type HighlightToken,
} from "@nox/core/lib/code-notation"
import { formatCode } from "@nox/core/lib/code-format"
import {
  Check,
  Clipboard,
  SquareChevronDown,
  SquareChevronUp,
} from "lucide-react"

type ComponentPreviewProps = {
  title?: string
  fileName?: string
  children: ReactNode
  className?: string
}

type CodeBlockSource = {
  source: string
  language?: string
}

function findCodeElement(node: ReactNode): ReactElement | null {
  const resolved = resolveLazyNode(node)
  if (resolved !== node) return findCodeElement(resolved)
  if (!isValidElement(node)) return null
  const type = typeof node.type === "string" ? node.type : ""
  if (type === "code") return node
  const props = node.props as { children?: ReactNode }
  const children = Children.toArray(props.children)
  for (const child of children) {
    const found = findCodeElement(child)
    if (found) return found
  }
  return null
}

function isLineElement(node: ReactNode): boolean {
  const resolved = resolveLazyNode(node)
  if (resolved !== node) return isLineElement(resolved)
  if (!isValidElement(node) || typeof node.type !== "string") return false
  const props = node.props as { className?: string } & Record<string, unknown>
  return (
    /(^|\s)line($|\s)/.test(String(props.className ?? "")) ||
    props["data-line"] !== undefined
  )
}

function extractCodeBlock(children: ReactNode): CodeBlockSource | null {
  const first = resolveLazyNode(Children.toArray(children)[0] ?? null)
  if (!isValidElement(first)) return null
  const type = typeof first.type === "string" ? first.type : ""
  if (type !== "figure" && type !== "pre" && type !== "code") return null

  const codeElement = findCodeElement(first)
  if (!codeElement) return null

  const raw = Children.toArray(
    (codeElement.props as { children?: ReactNode }).children
  )
  const lines =
    raw.length && raw.every(isLineElement)
      ? raw.map((line) => nodeToText(line).replace(/\n+$/, "")).join("\n")
      : nodeToText(raw)

  const source = lines.replace(/\n$/, "")
  if (!source.trim()) return null
  return { source, language: findDataLanguage(first) }
}

async function evaluateComponent(source: string) {
  const Babel = await import("@babel/standalone")
  const transformOptions = {
    sourceType: "module" as const,
    filename: "preview.tsx",
    presets: [
      ["react", { runtime: "classic" }],
      ["typescript", { ignoreExtensions: true }],
    ],
    plugins: ["transform-modules-commonjs", "syntax-jsx"],
  }

  const getExportedComponent = (code: string) => {
    const mod: { exports: Record<string, unknown> } = { exports: {} }
    const requireShim = (id: string) => {
      if (id === "react") return React
      if (id === "PackageManagerTabs") return PackageManagerTabs
      if (id === "CodeBlock") return CodeBlock
      if (id === "mdxui" || id.startsWith("mdxui/")) return previewRegistry
      throw new Error(`Modul "${id}" tidak tersedia di ComponentPreview.`)
    }
    const factory = new Function(
      "React",
      "PackageManagerTabs",
      "CodeBlock",
      "module",
      "exports",
      "require",
      code
    )
    factory(React, PackageManagerTabs, CodeBlock, mod, mod.exports, requireShim)
    return (
      mod.exports.default ??
      Object.values(mod.exports).find((value) => typeof value === "function")
    )
  }

  let Component = getExportedComponent(
    Babel.transform(source, transformOptions).code ?? ""
  )
  if (typeof Component !== "function") {
    try {
      const wrapped = `export default () => (${source.trim()})`
      Component = getExportedComponent(
        Babel.transform(wrapped, transformOptions).code ?? ""
      )
    } catch {
      Component = undefined
    }
  }

  if (typeof Component !== "function") {
    throw new Error("Tidak ada komponen yang diekspor dari blok kode.")
  }
  return Component
}

function resolveElementName(element: ReactNode): string {
  if (!isValidElement(element)) return "UnknownElementType"
  const type = element.type
  if (typeof type === "string") return type
  if (typeof type === "function") {
    const fn = type as Function & { displayName?: string; name?: string }
    return fn.displayName || fn.name || "UnknownElementType"
  }
  if (Array.isArray(type)) {
    const name = type[2]
    if (typeof name === "string") return name
  }
  if (type !== null && typeof type === "object") {
    const t = type as Record<string, unknown>
    const inner = t.type ?? t.render
    if (inner && typeof inner === "function" && inner.name)
      return (
        (inner as { displayName?: string }).displayName ||
        (inner as { name?: string }).name ||
        "UnknownElementType"
      )
    if (typeof t.$$name === "string") return t.$$name
    if (typeof t.displayName === "string") return t.displayName
    if (typeof t.name === "string") return t.name
  }
  return "UnknownElementType"
}

function getCode(children: ReactNode) {
  if (
    children === null ||
    children === undefined ||
    typeof children === "boolean"
  )
    return ""
  if (typeof children === "string" || typeof children === "number")
    return String(children)

  try {
    const options = {
      displayName: resolveElementName,
      showDefaultProps: false,
      sortProps: false,
      useBooleanShorthandSyntax: true,
      useFragmentShortSyntax: true,
    }
    return Children.toArray(children)
      .map((element) => elementToJSXString(element as ReactElement, options))
      .join("\n")
  } catch {
    return "// Kode komponen tidak dapat ditampilkan."
  }
}

export function ComponentPreview({
  title,
  fileName,
  children,
  className,
}: ComponentPreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [previewNode, setPreviewNode] = useState<ReactNode>(null)
  const [evalError, setEvalError] = useState<string | null>(null)
  const codeBlock = useMemo(() => extractCodeBlock(children), [children])
  const rawCode = useMemo(
    () => (codeBlock ? codeBlock.source : getCode(children)),
    [children, codeBlock]
  )
  const [code, setCode] = useState(rawCode)
  const [highlightedLines, setHighlightedLines] = useState<HighlightToken[][]>(
    []
  )
  const language = resolveCodeLanguage({
    filename: fileName,
    text: rawCode,
    dataLanguage: codeBlock?.language,
  })
  const lines = code.split("\n")
  const isLongCode = mounted && lines.length > 10

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setPreviewNode(null)
    setEvalError(null)
    if (!codeBlock) return
    let active = true
    evaluateComponent(codeBlock.source)
      .then((Component) => {
        if (!active) return
        setPreviewNode(React.createElement(Component as React.ComponentType))
        setEvalError(null)
      })
      .catch((error: unknown) => {
        if (!active) return
        setPreviewNode(null)
        setEvalError(error instanceof Error ? error.message : String(error))
      })
    return () => {
      active = false
    }
  }, [codeBlock])

  useEffect(() => {
    let active = true
    formatCode(rawCode, language).then((formatted) => {
      if (active) setCode(formatted.trimEnd())
    })
    return () => {
      active = false
    }
  }, [rawCode, language])

  useEffect(() => {
    let active = true
    highlightCode(code, language).then((tokens) => {
      if (active) setHighlightedLines(tokens)
    })
    return () => {
      active = false
    }
  }, [code, language])

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const codePanel = (
    <div className="bg-muted">
      <pre
        className={cn(
          "overflow-auto p-4 text-left text-sm leading-6 text-foreground",
          isLongCode && !expanded && "max-h-70"
        )}
      >
        <code className="grid min-w-max grid-cols-[auto_1fr]">
          {lines.map((line, index) => (
            <span key={`${index}-${line}`} className="contents">
              <span
                aria-hidden="true"
                className="pr-4 text-right text-muted-foreground/60 select-none"
              >
                {index + 1}
              </span>
              <span>
                {(
                  highlightedLines[index] ?? [
                    { content: line || " ", color: "inherit" },
                  ]
                ).map((token, tokenIndex) => (
                  <span
                    key={`${index}-${tokenIndex}-${token.content}`}
                    style={{
                      color: token.color,
                      fontStyle: token.fontStyle === 1 ? "italic" : undefined,
                    }}
                  >
                    {token.content}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
      {isLongCode && (
        <div className="flex items-center justify-center border-t border-border/60 bg-muted px-4 py-1">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((visible) => !visible)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {expanded ? (
              <SquareChevronUp aria-hidden="true" className="size-3.5" />
            ) : (
              <SquareChevronDown aria-hidden="true" className="size-3.5" />
            )}
            {expanded ? "Sembunyikan sebagian" : "Tampilkan semua"}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <section
      aria-label={title ?? fileName ?? "Component preview"}
      className={cn("overflow-hidden rounded-xl border bg-card", className)}
    >
      <div
        role="tablist"
        aria-label="Component views"
        className="flex items-end justify-between gap-4 border-b px-4 pt-3"
      >
        <div className="flex items-end">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "preview"}
            onClick={() => setActiveTab("preview")}
            className={cn(
              "border-b-2 px-3 pb-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              activeTab === "preview"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "code"}
            onClick={() => setActiveTab("code")}
            className={cn(
              "border-b-2 px-3 pb-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              activeTab === "code"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Code
          </button>
        </div>
        <div className="flex min-w-0 items-center gap-2 pb-2">
          {fileName && (
            <span className="max-w-40 truncate font-mono text-xs text-muted-foreground">
              {fileName}
            </span>
          )}
          <button
            type="button"
            onClick={copyCode}
            className="shrink-0 rounded text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {copied ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Clipboard aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>

      {mounted && activeTab === "preview" && (
        <div
          role="tabpanel"
          className="flex min-h-32 items-center justify-center p-8"
        >
          {codeBlock ? (
            evalError ? (
              <pre className="w-full overflow-x-auto rounded-md border border-destructive/40 bg-destructive/5 p-4 text-left text-xs leading-5 text-destructive">
                {evalError}
              </pre>
            ) : (
              previewNode
            )
          ) : (
            children
          )}
        </div>
      )}
      {mounted && activeTab === "code" && (
        <div role="tabpanel">{codePanel}</div>
      )}
    </section>
  )
}

export default ComponentPreview
