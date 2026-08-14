"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Check, Copy, SquareChevronDown, SquareChevronUp } from "lucide-react"
import { cn } from "@nox/lib/utils"
import { Button } from "@nox/components/button"
import {
  cleanCode,
  findDataLanguage,
  highlightCode,
  nodeToText,
  resolveCodeLanguage,
  type HighlightToken,
} from "@nox/lib/code-notation"
import { formatCode } from "@nox/lib/code-format"

type CodeBlockProps = {
  filename?: string
  inline?: boolean
  children: ReactNode
  className?: string
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
  const language = resolveCodeLanguage({ filename, text, dataLanguage })
  const [displayCode, setDisplayCode] = useState(code)
  const lines = displayCode.split("\n")
  const isLongCode = lines.length > 10

  useEffect(() => {
    let active = true
    formatCode(code, language).then((formatted) => {
      if (active) setDisplayCode(formatted)
    })
    return () => {
      active = false
    }
  }, [code, language])

  useEffect(() => {
    let active = true
    highlightCode(displayCode, language).then((tokens) => {
      if (active) setHighlightedLines(tokens)
    })
    return () => {
      active = false
    }
  }, [displayCode, language])

  async function copyCode() {
    await navigator.clipboard.writeText(displayCode)
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
