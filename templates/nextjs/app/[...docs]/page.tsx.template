import { NoxRender } from "noxkit"

export default async function DocsPage({
  params,
}: {
  params: Promise<{ docs?: string[] }>
}) {
  const { docs = [] } = await params
  const segments = docs[0] === "docs" ? docs.slice(1) : docs

  return <NoxRender dir="/docs" slug={segments.join("/")} />
}
