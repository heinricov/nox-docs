import React from "react"
import { slugify } from "@nox/lib/mdx"

export const mdxTypographyComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2
      id={slugify(String(children ?? ""))}
      className="mt-8 scroll-mt-2 text-xl font-semibold tracking-tight text-foreground"
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3
      id={slugify(String(children ?? ""))}
      className="mt-6 scroll-mt-2 text-lg font-semibold tracking-tight text-foreground"
    >
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4
      id={slugify(String(children ?? ""))}
      className="mt-5 scroll-mt-2 text-base font-semibold tracking-tight text-foreground"
    >
      {children}
    </h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[15px]/relaxed text-foreground/80">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="ml-4 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="ml-4 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="marker:text-muted-foreground">{children}</li>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="overflow-x-auto border border-border bg-background p-4 text-left font-mono text-xs text-foreground">
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-primary pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  hr: () => <hr className="my-8 border-border" />,
}

export default mdxTypographyComponents