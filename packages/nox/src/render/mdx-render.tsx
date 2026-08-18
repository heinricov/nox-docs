import { compileMDX } from "next-mdx-remote/rsc"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import type { Pluggable } from "unified"
import { mdxTypographyComponents } from "../common/typography"
import { CodeBlock } from "../common/code-block"
import {
  CodeDiff,
  NewCode,
  NewFile,
  OldCode,
  OldFile,
} from "../common/code-diff"
import { ComponentPreview } from "../common/component-preview"
import { PackageManagerTabs } from "../common/package-manager-tabs"
import { File, Folder, ProjectTree } from "../common/project-tree"
import { TabsSection, TabsContent } from "../common/tabs-section"
import { mdxTableComponents } from "../common/tabel-render"
import {
  Command,
  Option,
  Process,
  QuestionStep,
  Result,
  SuccessProcess,
  TerminalView,
} from "../common/terminal-view"

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
  TabsSection,
  TabsContent,
  ProjectTree,
  Folder,
  File,
  TerminalView,
  Command,
  SuccessProcess,
  QuestionStep,
  Option,
  Process,
  Result,
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
