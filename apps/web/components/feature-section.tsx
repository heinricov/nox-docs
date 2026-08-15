import type { LucideIcon } from "lucide-react"
import {
  Blocks,
  Braces,
  FileText,
  FolderTree,
  LayoutTemplate,
  MoonStar,
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type Feature = {
  icon: LucideIcon
  title: string
  copy: string
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "MDX native",
    copy: "Tulis dokumentasi sebagai file .mdx dengan frontmatter, dan nox merender sisanya.",
  },
  {
    icon: LayoutTemplate,
    title: "Layout terpadu",
    copy: "NoxLayout menyusun header, sidebar, konten, dan footer dalam satu komponen responsif.",
  },
  {
    icon: FolderTree,
    title: "Sidebar otomatis",
    copy: "Navigasi dibangun dari struktur folder content/ dan meta.ts, tanpa konfigurasi manual.",
  },
  {
    icon: Braces,
    title: "Syntax highlighting",
    copy: "Blok kode dirender dengan rehype-pretty-code dan shiki, lengkap dengan baris yang disorot.",
  },
  {
    icon: Blocks,
    title: "Komponen siap pakai",
    copy: "CodeBlock, TerminalView, ComponentPreview, ProjectTree, dan lainnya langsung dipakai di MDX.",
  },
  {
    icon: MoonStar,
    title: "Dark mode",
    copy: "Theming terintegrasi dengan tombol tema bawaan di header dan palet warna yang konsisten.",
  },
]

export default function FeatureSection() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Features
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Segalanya untuk membangun situs dokumentasi
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fokus pada konten, dan biarkan nox mengurus layout, navigasi, dan
            rendering MDX.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map(({ icon: Icon, title, copy }) => (
            <Card key={title} className="p-6">
              <CardHeader className="p-0">
                <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="mt-4 text-base font-semibold">
                  {title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm">
                  {copy}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
