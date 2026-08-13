import { MdxLayout } from "@nox/mdx-render/mdx-layout"

export default async function DocsPage({
  params,
}: {
  params: Promise<{ docs?: string[] }>
}) {
  const { docs = [] } = await params
  const segments = docs[0] === "docs" ? docs.slice(1) : docs

  return <MdxLayout dir="/docs" slug={segments.join("/")} />
}
