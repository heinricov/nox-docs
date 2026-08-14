import { Children, isValidElement } from "react"
import type { ReactNode } from "react"
import { codeToTokens } from "shiki"
import type { BundledLanguage, SpecialLanguage } from "shiki"

export type HighlightToken = {
  content: string
  color?: string
  fontStyle?: number
}

export type HighlightLanguage = BundledLanguage | SpecialLanguage

export const CODE_THEME = "github-dark"

const REACT_LAZY_TYPE =
  typeof Symbol === "function" && Symbol.for ? Symbol.for("react.lazy") : 0xead

export function resolveLazyNode(node: ReactNode): ReactNode {
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

export function nodeToText(node: ReactNode): string {
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

export function cleanCode(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n").trim()
  const fenced = normalized.match(/^```(?:[\w+-]+)?\s*\n([\s\S]*?)\n```$/)
  return (fenced?.[1] ?? normalized).replace(/^\n+|\n+$/g, "")
}

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  bash: "bash",
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
  mjs: "javascript",
  mts: "typescript",
  php: "php",
  py: "python",
  rb: "ruby",
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

export function getLanguageFromFilename(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase() ?? ""
  return LANGUAGE_BY_EXTENSION[extension] ?? "code"
}

export function getFenceLanguage(text: string): string | undefined {
  return text.match(/^```([\w+-]+)/)?.[1]
}

export function findDataLanguage(node: ReactNode): string | undefined {
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

export function resolveCodeLanguage({
  filename,
  text,
  dataLanguage,
}: {
  filename?: string
  text?: string
  dataLanguage?: string
}): string {
  if (filename) return getLanguageFromFilename(filename)
  return dataLanguage ?? getFenceLanguage(text ?? "") ?? "code"
}

export function getHighlightLanguage(language: string): HighlightLanguage {
  if (language === "mdx" || language === "code") return "jsx"
  return language as HighlightLanguage
}

export async function highlightCode(
  code: string,
  language: string
): Promise<HighlightToken[][]> {
  try {
    const { tokens } = await codeToTokens(code, {
      lang: getHighlightLanguage(language),
      theme: CODE_THEME,
    })
    return tokens
  } catch {
    return []
  }
}