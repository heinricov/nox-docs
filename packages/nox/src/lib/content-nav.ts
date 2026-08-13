import { promises as fs } from "node:fs"
import path from "node:path"
import ts from "typescript"

export type ContentNavItem = {
  title: string
  url: string
  href?: boolean
  type?: "main" | "collaps"
  items?: ContentNavItem[]
}

export type ContentSection = {
  label: string
  type: "main" | "collaps"
  href?: boolean
  url?: string
  menus: ContentNavItem[]
}

export type RootFolderMeta = {
  folder: string
  label?: string
  type?: string
  hidden?: boolean
}

type FolderMeta = {
  label?: string
  type?: string
  order?: string[]
}

function evalNode(node: ts.Node): unknown {
  if (ts.isExpressionStatement(node)) {
    return evalNode(node.expression)
  }
  if (ts.isParenthesizedExpression(node)) {
    return evalNode(node.expression)
  }
  if (ts.isObjectLiteralExpression(node)) {
    const out: Record<string, unknown> = {}
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        out[prop.name.getText().replace(/['"]/g, "")] = evalNode(prop.initializer)
      } else if (ts.isShorthandPropertyAssignment(prop)) {
        out[prop.name.getText()] = prop.name.getText()
      }
    }
    return out
  }
  if (ts.isBlock(node)) {
    const out: Record<string, unknown> = {}
    for (const stmt of node.statements) {
      if (ts.isLabeledStatement(stmt)) {
        out[stmt.label.getText().replace(/['"]/g, "")] = evalNode(stmt.statement)
      } else if (ts.isExpressionStatement(stmt)) {
        const expr = stmt.expression
        if (ts.isObjectLiteralExpression(expr)) {
          Object.assign(out, evalNode(expr))
        } else {
          out[`__expr${Object.keys(out).length}`] = evalNode(expr)
        }
      }
    }
    return out
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => evalNode(element))
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  return undefined
}

function parseDataValue(source: string): unknown {
  const sourceFile = ts.createSourceFile(
    "meta.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  const first = sourceFile.statements.find((statement) => !ts.isEmptyStatement(statement))
  if (!first) return undefined
  if (ts.isExpressionStatement(first)) return evalNode(first.expression)
  if (ts.isBlock(first)) return evalNode(first)
  if (ts.isLabeledStatement(first)) {
    return { [first.label.getText().replace(/['"]/g, "")]: evalNode(first.statement) }
  }
  return undefined
}

async function parseFolderMeta(
  dir: string,
  folderName: string
): Promise<FolderMeta | null> {
  let source: string
  try {
    source = await fs.readFile(path.join(dir, "meta.ts"), "utf8")
  } catch {
    return null
  }

  const value = parseDataValue(source)
  if (typeof value !== "object" || value === null) return null

  const root = value as Record<string, unknown>
  const raw = root[folderName] ?? Object.values(root)[0]
  if (typeof raw !== "object" || raw === null) return null

  const obj = raw as Record<string, unknown>
  return {
    label: typeof obj.label === "string" ? obj.label : undefined,
    type: typeof obj.type === "string" ? obj.type : undefined,
    order: Array.isArray(obj.order)
      ? obj.order.filter((key): key is string => typeof key === "string")
      : undefined,
  }
}

function humanize(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function urlFor(contentRoot: string, absPath: string): string {
  const rel = path
    .relative(contentRoot, absPath)
    .replace(/\\/g, "/")
    .replace(/\.mdx$/, "")
  const [top, ...rest] = rel.split("/")
  const base = `/${top ?? "docs"}`
  return rest.length ? `${base}/${rest.join("/")}` : base
}

async function hasMdx(dir: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".mdx")) return true
      if (entry.isDirectory() && (await hasMdx(path.join(dir, entry.name)))) return true
    }
  } catch {
    // directory not readable
  }
  return false
}

async function hasIndex(dir: string): Promise<boolean> {
  try {
    await fs.access(path.join(dir, "index.mdx"))
    return true
  } catch {
    return false
  }
}

async function buildFolderItems(
  contentRoot: string,
  dir: string
): Promise<ContentNavItem[]> {
  const meta = await parseFolderMeta(dir, path.basename(dir))
  const entries = await fs.readdir(dir, { withFileTypes: true })

  const files: string[] = []
  const subdirs: string[] = []
  await Promise.all(
    entries.map(async (entry) => {
      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(entry.name.replace(/\.mdx$/, ""))
      } else if (entry.isDirectory() && (await hasMdx(path.join(dir, entry.name)))) {
        subdirs.push(entry.name)
      }
    })
  )

  const contentFiles = files.filter((name) => name !== "index")
  const order = meta?.order ?? []
  const sortKey = (name: string) => {
    const index = order.indexOf(name)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }
  const ordered = [...contentFiles, ...subdirs].sort((a, b) => sortKey(a) - sortKey(b))

  const items: ContentNavItem[] = []
  for (const key of ordered) {
    if (contentFiles.includes(key)) {
      items.push({
        title: humanize(key),
        url: urlFor(contentRoot, path.join(dir, `${key}.mdx`)),
      })
      continue
    }

    const subDir = path.join(dir, key)
    const subMeta = await parseFolderMeta(subDir, key)
    const subIndex = await hasIndex(subDir)
    items.push({
      title: subMeta?.label ?? humanize(key),
      url: urlFor(contentRoot, subDir),
      href: subIndex ? undefined : false,
      type: subMeta?.type === "main" ? "main" : "collaps",
      items: await buildFolderItems(contentRoot, subDir),
    })
  }

  return items
}

async function buildSection(
  contentRoot: string,
  dir: string,
  folderName: string,
  config?: RootFolderMeta
): Promise<ContentSection | null> {
  const meta = await parseFolderMeta(dir, folderName)
  const items = await buildFolderItems(contentRoot, dir)
  const indexFile = await hasIndex(dir)
  if (items.length === 0 && !indexFile) return null

  return {
    label: config?.label ?? meta?.label ?? humanize(folderName),
    type:
      (config?.type ?? meta?.type) === "collaps" ? "collaps" : "main",
    href: config?.hidden === true ? false : indexFile,
    url: indexFile ? urlFor(contentRoot, dir) : undefined,
    menus: items,
  }
}

export async function getContentRoot(): Promise<string | null> {
  const candidates = [
    path.join(/* turbopackIgnore: true */ process.cwd(), "content"),
    path.join(/* turbopackIgnore: true */ process.cwd(), "apps/docs/content"),
  ]
  for (const dir of candidates) {
    try {
      const stat = await fs.stat(dir)
      if (stat.isDirectory()) return dir
    } catch {
      // try next candidate
    }
  }
  return null
}

async function getRootOrder(contentRoot: string): Promise<RootFolderMeta[]> {
  let source: string
  try {
    source = await fs.readFile(path.join(contentRoot, "meta.ts"), "utf8")
  } catch {
    return []
  }

  const value = parseDataValue(source)
  if (!Array.isArray(value)) return []

  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return []
    const obj = entry as Record<string, unknown>
    if (typeof obj.folder !== "string") return []
    return [
      {
        folder: obj.folder,
        label: typeof obj.label === "string" ? obj.label : undefined,
        type: typeof obj.type === "string" ? obj.type : undefined,
        hidden: obj.hidden === true,
      },
    ]
  })
}

export async function getContentSections(folder?: string): Promise<ContentSection[]> {
  const contentRoot = await getContentRoot()
  if (!contentRoot) return []

  const dirName = folder?.replace(/^\/+|\/+$/g, "")

  if (dirName) {
    const rel = dirName.split("/")
    const dir = path.join(contentRoot, ...rel)
    if (!(await hasMdx(dir))) return []
    const section = await buildSection(contentRoot, dir, rel[rel.length - 1] ?? dirName)
    return section ? [section] : []
  }

  const entries = await fs.readdir(contentRoot, { withFileTypes: true })
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  const order = await getRootOrder(contentRoot)
  const ordered = order.filter((config) => folders.includes(config.folder))
  const rest = folders
    .filter((name) => !ordered.some((config) => config.folder === name))
    .sort()

  const sections: ContentSection[] = []
  for (const config of ordered) {
    if (config.hidden) continue
    const dir = path.join(contentRoot, config.folder)
    if (!(await hasMdx(dir))) continue
    const section = await buildSection(contentRoot, dir, config.folder, config)
    if (section) sections.push(section)
  }
  for (const name of rest) {
    const dir = path.join(contentRoot, name)
    if (!(await hasMdx(dir))) continue
    const section = await buildSection(contentRoot, dir, name)
    if (section) sections.push(section)
  }
  return sections
}

export async function getContentFolderNames(): Promise<string[]> {
  const contentRoot = await getContentRoot()
  if (!contentRoot) return []
  const entries = await fs.readdir(contentRoot, { withFileTypes: true })
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}