import React from "react"
import { notFound, redirect } from "next/navigation"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import { MdxBreadcrumb } from "./mdx-breadcrumb"
import { MdxHeader } from "./mdx-header"
import { MdxRenderer } from "./mdx-render"
import { MdxToc } from "./mdx-toc"
import { MdxPagination, type MdxNavLink } from "./mdx-pagination"
import { extractMdxFrontmatter, extractMdxHeadings } from "@nox/lib/mdx"
import { readContentMdx } from "@nox/lib/content-mdx"
import {
  getContentSections,
  type ContentNavItem,
  type ContentSection,
} from "@nox/lib/content-nav"

function humanize(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function toNavLink(item: ContentNavItem): MdxNavLink {
  return { title: item.title, url: item.url }
}

function collectPages(items: ContentNavItem[], out: ContentNavItem[]): void {
  for (const item of items) {
    if (item.items?.length) collectPages(item.items, out)
    else if (item.href !== false) out.push(item)
  }
}

function findPrevNext(
  sections: ContentSection[],
  currentUrl: string
): { previous?: MdxNavLink; next?: MdxNavLink } {
  const pages: ContentNavItem[] = []
  for (const section of sections) collectPages(section.menus, pages)

  const index = pages.findIndex((item) => item.url === currentUrl)
  if (index === -1) return {}
  return {
    previous: index > 0 ? toNavLink(pages[index - 1]!) : undefined,
    next: index < pages.length - 1 ? toNavLink(pages[index + 1]!) : undefined,
  }
}

export async function MdxLayout({
  dir = "/docs",
  slug = "",
  components,
}: {
  dir?: string
  slug?: string
  components?: MDXRemoteProps["components"]
}) {
  const folder = dir.replace(/^\/+|\/+$/g, "")
  const segments = slug.split("/").filter(Boolean)
  const isIndex = segments.length === 0

  const relPath = isIndex ? "index" : segments.join("/")
  let file = await readContentMdx(dir, relPath)
  if (!file && !isIndex) file = await readContentMdx(dir, `${relPath}/index`)
  if (!file) {
    if (isIndex) {
      const sections = await getContentSections(folder)
      redirect(sections[0]?.menus[0]?.url ?? `/${folder}/introduction`)
    }
    notFound()
  }

  const sections = await getContentSections(folder)

  const displayPath = file.relativePath
    .replace(/\/index$/, "")
    .replace(/^index$/, "")
  const currentUrl =
    `/${folder}/${displayPath.replace(`${folder}/`, "")}`.replace(/\/$/, "")
  const { previous, next } = findPrevNext(sections, currentUrl)

  const crumbPath = displayPath.split("/").filter(Boolean)
  const breadcrumbs = crumbPath.map(humanize)

  const frontmatter = extractMdxFrontmatter(file.source)
  const headings = extractMdxHeadings(file.source).map((heading) => ({
    id: heading.id,
    title: heading.title,
  }))

  return (
    <section className="flex min-h-svh w-full justify-center overflow-x-clip bg-background px-2 py-4 text-foreground">
      <div className="flex w-full max-w-6xl flex-col gap-2 lg:flex-row lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <MdxBreadcrumb items={breadcrumbs} />
          <MdxHeader
            title={frontmatter.title}
            description={frontmatter.description}
            createdAt={file.createdAt}
            updatedAt={file.updatedAt}
          />
          <MdxRenderer source={file.source} components={components} />
          <MdxPagination previous={previous} next={next} />
        </div>
        {headings.length ? <MdxToc sections={headings} /> : null}
      </div>
    </section>
  )
}
