import { compileMDX } from "next-mdx-remote/rsc"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import type { Pluggable } from "unified"
import { slugify } from "mdxui/lib/mdx"
import { CodeBlock } from "mdxui/components/common/code-block"
import {
  CodeDiff,
  NewCode,
  NewFile,
  OldCode,
  OldFile,
} from "mdxui/components/common/code-diff"
import { ComponentPreview } from "mdxui/components/common/component-preview"
import { PackageManagerTabs } from "mdxui/components/common/package-manager-tabs"
import {
  File,
  Folder,
  ProjectTree,
} from "mdxui/components/common/project-tree"
import { mdxTableComponents } from "mdxui/components/common/tabel-render"
import {
  AsciiArt,
  Cancelled,
  Command,
  Done,
  Option,
  Process,
  Prompt,
  Question,
  ResultsProcess,
  TerminalStep,
  TerminalView,
} from "mdxui/components/common/terminal-view"

const prettyCode: Pluggable = [
  rehypePrettyCode,
  {
    theme: { light: "github-light", dark: "github-dark" },
    keepBackground: false,
  },
]

const mdxComponents = {
  ...mdxTableComponents,
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
  CodeBlock,
  CodeDiff,
  OldCode,
  NewCode,
  OldFile,
  NewFile,
  ComponentPreview,
  PackageManagerTabs,
  ProjectTree,
  Folder,
  File,
  TerminalView,
  AsciiArt,
  Command,
  ResultsProcess,
  Question,
  Option,
  Prompt,
  Done,
  Cancelled,
  Process,
  TerminalStep,
}

export async function MdxRenderer({
  source,
  components,
}: {
  source: string
  components?: MDXRemoteProps["components"]
}) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      blockJS: false,
      mdxOptions: {
        useDynamicImport: true,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [prettyCode],
      },
    },
    components: { ...mdxComponents, ...components },
  })

  return (
    <div className="flex flex-col gap-5 text-[15px]/relaxed text-foreground/80">
      {content}
    </div>
  )
}
