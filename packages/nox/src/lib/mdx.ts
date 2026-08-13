export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
}

export function extractMdxFrontmatter(source: string): Record<string, string> {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/)
  const body = match?.[1]
  if (!body) return {}

  const out: Record<string, string> = {}
  for (const line of body.split(/\r?\n/)) {
    const parsed = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(?:"([^"]*)"|'([^']*)'|(.+))$/)
    if (parsed?.[1]) out[parsed[1]] = parsed[2] ?? parsed[3] ?? parsed[4] ?? ""
  }
  return out
}

export type MdxHeading = { level: number; title: string; id: string }

export function extractMdxHeadings(
  source: string,
  minLevel = 2,
  maxLevel = 4
): MdxHeading[] {
  const headings: MdxHeading[] = []
  let inCode = false

  for (const line of source.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inCode = !inCode
      continue
    }
    if (inCode) continue

    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match?.[1] && match[2]) {
      const level = match[1].length
      if (level < minLevel || level > maxLevel) continue
      const title = match[2].trim()
      headings.push({ level, title, id: slugify(title) })
    }
  }

  return headings
}