import { compileMDX } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import type { Pluggable } from "unified"
import { mdxTypographyComponents } from "./typography"
import { mdxTableComponents } from "./tabel-render"
import { ComponentPreview } from "./component-preview"

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
}

export async function MdxPreview({
  source,
  title,
  fileName,
}: {
  source: string
  title?: string
  fileName?: string
}) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [prettyCode],
      },
    },
    components: mdxComponents,
  })

  return (
    <ComponentPreview
      title={title}
      fileName={fileName}
      lang="mdx"
      source={source}
    >
      {content}
    </ComponentPreview>
  )
}
