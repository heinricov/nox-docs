"use client"

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Check, Copy, SquareChevronDown, SquareChevronUp } from "lucide-react"
import { codeToTokens } from "shiki"
import type { BundledLanguage, SpecialLanguage } from "shiki"
import { cn } from "@nox/lib/utils"
import { Button } from "@nox/components/button"

type CodeBlockProps = {
  filename?: string
  inline?: boolean
  children: ReactNode
  className?: string
}

type HighlightToken = {
  content: string
  color?: string
  fontStyle?: number
}

const REACT_LAZY_TYPE =
  typeof Symbol === "function" && Symbol.for ? Symbol.for("react.lazy") : 0xead

function resolveLazyNode(node: ReactNode): ReactNode {
  if (node && typeof node === "object") {
    const lazy = node as {
      $$typeof?: unknown
      _init?: (payload: unknown) => ReactNode
      _payload?: unknown
    }
    if (lazy.$$typeof === REACT_LAZY_TYPE && typeof lazy._init === "function") {
      try {
        return lazy._init(lazy._payload)
      } catch {
        return ""
      }
    }
  }
  return node
}

function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join("")
  const resolved = resolveLazyNode(node)
  if (resolved !== node) return nodeToText(resolved)
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return nodeToText(node.props.children)
  }
  return ""
}

function cleanCode(value: string) {
  const normalized = value.replace(/\r\n/g, "\n").trim()
  const fenced = normalized.match(/^```(?:[\w+-]+)?\s*\n([\s\S]*?)\n```$/)
  return (fenced?.[1] ?? normalized).replace(/^\n+|\n+$/g, "")
}

const languageByExtension: Record<string, string> = {
  c: "c",
  cjs: "javascript",
  cpp: "cpp",
  css: "css",
  go: "go",
  html: "html",
  java: "java",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  md: "markdown",
  mdx: "mdx",
  py: "python",
  rs: "rust",
  scss: "scss",
  sh: "bash",
  sql: "sql",
  svg: "xml",
  ts: "typescript",
  tsx: "tsx",
  vue: "vue",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
}

function getLanguage(title: string) {
  const extension = title.split(".").pop()?.toLowerCase() ?? ""
  return languageByExtension[extension] ?? "code"
}

function getHighlightLanguage(
  language: string
): BundledLanguage | SpecialLanguage {
  if (language === "mdx" || language === "code") return "jsx"
  return language as BundledLanguage | SpecialLanguage
}

function getFenceLanguage(text: string): string | undefined {
  return text.match(/^```([\w+-]+)/)?.[1]
}

function findDataLanguage(node: ReactNode): string | undefined {
  const resolved = resolveLazyNode(node)
  if (resolved !== node) return findDataLanguage(resolved)
  if (!isValidElement(node)) return undefined
  const props = node.props as Record<string, unknown> & { children?: ReactNode }
  if (typeof props["data-language"] === "string") return props["data-language"]
  const children = Children.toArray(props.children)
  for (const child of children) {
    const language = findDataLanguage(child)
    if (language) return language
  }
  return undefined
}

export function CodeBlock({
  filename,
  inline = false,
  children,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [highlightedLines, setHighlightedLines] = useState<
    Array<Array<HighlightToken>>
  >([])

  const text = useMemo(() => nodeToText(children), [children])
  const code = useMemo(() => cleanCode(text), [text])
  const dataLanguage = useMemo(() => findDataLanguage(children), [children])
  const language = filename
    ? getLanguage(filename)
    : (dataLanguage ?? getFenceLanguage(text) ?? "code")
  const lines = code.split("\n")
  const isLongCode = lines.length > 10

  useEffect(() => {
    let active = true
    codeToTokens(code, {
      lang: getHighlightLanguage(language),
      theme: "github-dark",
    })
      .then(({ tokens }) => {
        if (active) setHighlightedLines(tokens)
      })
      .catch(() => {
        if (active) setHighlightedLines([])
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

  return (
    <div
      className={cn(
        "relative my-6 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        inline && "my-4 rounded-lg",
        className
      )}
    >
      {!inline && (
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {filename ?? "code"}
          </span>
          <CopyButton copied={copied} onClick={copyCode} />
        </div>
      )}
      <div className="bg-muted">
        <pre
          className={cn(
            "overflow-auto p-4 text-left text-sm leading-6 text-foreground",
            isLongCode && !expanded && (inline ? "max-h-20 p-0" : "max-h-70"),
            inline && "pr-14"
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
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
      {inline && (
        <span className="absolute top-1/2 right-2 -translate-y-1/2">
          <CopyButton copied={copied} onClick={copyCode} />
        </span>
      )}
    </div>
  )
}

function CopyButton({
  copied,
  onClick,
}: {
  copied: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "Code copied" : "Copy code"}
      onClick={onClick}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </Button>
  )
}

export type { CodeBlockProps }
