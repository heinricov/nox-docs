import { NoxRender } from "noxkit"
import { DemoButton } from "@/components/examples/demo-button"
import { PlainNotice } from "@/components/examples/plain-notice"

const mdxComponents = {
  DemoButton,
  PlainNotice,
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ docs?: string[] }>
}) {
  const { docs = [] } = await params
  const segments = docs[0] === "docs" ? docs.slice(1) : docs

  return (
    <NoxRender
      dir="/docs"
      slug={segments.join("/")}
      components={mdxComponents}
    />
  )
}
