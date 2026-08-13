import { promises as fs } from "node:fs"
import path from "node:path"

export type ManifestMenuItem = {
  title: string
  url: string
}

const RESERVED_PREFIX = "/_"

async function readAppPathsManifest(): Promise<Record<string, string>> {
  const candidates = [
    path.join(/* turbopackIgnore: true */ process.cwd(), ".next/server/app-paths-manifest.json"),
    path.join(
      /* turbopackIgnore: true */ process.cwd(),
      "apps/docs/.next/server/app-paths-manifest.json"
    ),
  ]

  for (const file of candidates) {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"))
    } catch {
      // try the next candidate
    }
  }

  return {}
}

function titleFromSegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function titleFromRoute(route: string): string {
  if (route === "/page") return "Home"

  const segment = route
    .replace(/^\/|\/page$/g, "")
    .split("/")
    .filter(Boolean)
    .at(-1)

  return segment ? titleFromSegment(segment) : "Home"
}

export async function getAppMenus(): Promise<ManifestMenuItem[]> {
  const manifest = await readAppPathsManifest()

  const menus = Object.keys(manifest)
    .filter((route) => route.endsWith("/page") && !route.startsWith(RESERVED_PREFIX))
    .sort((a, b) => {
      if (a === "/page") return -1
      if (b === "/page") return 1
      return a.localeCompare(b)
    })
    .map((route) => {
      const catchAll = route.match(/\[\.\.\.([^\]]+)\]/)
      if (catchAll?.[1]) {
        return { title: titleFromSegment(catchAll[1]), url: `/${catchAll[1]}` }
      }
      const dynamic = route.match(/\[([^\]]+)\]/)
      if (dynamic?.[1]) {
        return { title: titleFromSegment(dynamic[1]), url: `/${dynamic[1]}` }
      }
      return { title: titleFromRoute(route), url: route.replace(/\/page$/, "") || "/" }
    })

  return menus.length > 0
    ? menus
    : [
        { title: "Home", url: "/" },
        { title: "Docs", url: "/docs" },
      ]
}