import { compileMDX } from "next-mdx-remote/rsc"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import type { Pluggable } from "unified"
import { mdxTypographyComponents } from "@nox/core/common/typography"
import { CodeBlock } from "@nox/core/common/code-block"
import {
  CodeDiff,
  NewCode,
  NewFile,
  OldCode,
  OldFile,
} from "@nox/core/common/code-diff"
import { ComponentPreview } from "@nox/core/common/component-preview"
import { PackageManagerTabs } from "@nox/core/common/package-manager-tabs"
import { File, Folder, ProjectTree } from "@nox/core/common/project-tree"
import { mdxTableComponents } from "@nox/core/common/tabel-render"
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
} from "@nox/core/common/terminal-view"

const prettyCode: Pluggable = [
  rehypePrettyCode,
  {
    theme: { light: "github-light", dark: "github-dark" },
    keepBackground: false,
  },
]

const mdxComponents = {
  ...mdxTableComponents,
  ...mdxTypographyComponents,
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
