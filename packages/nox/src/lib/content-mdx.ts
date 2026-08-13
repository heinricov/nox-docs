import { promises as fs } from "node:fs"
import path from "node:path"

import { getContentRoot } from "./content-nav"

export type MdxFile = {
  source: string
  relativePath: string
  createdAt: string
  updatedAt: string
}

export function resolveContentPath(contentRoot: string, relPath: string): string {
  const safePath = relPath.replace(/\.\.(\/|\\)|^\.\.$/g, "").replace(/\.mdx$/i, "")
  const filePath = path.join(contentRoot, `${safePath}.mdx`)
  if (!filePath.startsWith(contentRoot)) throw new Error("Path outside content directory")
  return filePath
}

export async function readContentMdx(
  dirOrPath: string,
  relPath?: string
): Promise<MdxFile | null> {
  const contentRoot = await getContentRoot()
  if (!contentRoot) return null

  const folder = (relPath !== undefined ? dirOrPath : "").replace(/^\/+|\/+$/g, "")
  const inner = (relPath !== undefined ? relPath : dirOrPath).replace(/^\/+|\/+$/g, "")
  const safePath = inner.replace(/\.\.(\/|\\)|^\.\.$/g, "").replace(/\.mdx$/i, "")

  const segments = folder ? [folder, ...safePath.split("/")] : safePath.split("/")
  const filePath = path.join(contentRoot, ...segments.map((s) => s || ".")) + ".mdx"
  if (!filePath.startsWith(contentRoot)) return null

  try {
    const source = await fs.readFile(filePath, "utf8")
    const stat = await fs.stat(filePath)
    return {
      source,
      relativePath: path.relative(contentRoot, filePath).replace(/\.mdx$/, ""),
      createdAt: stat.birthtime.toISOString(),
      updatedAt: stat.mtime.toISOString(),
    }
  } catch {
    return null
  }
}