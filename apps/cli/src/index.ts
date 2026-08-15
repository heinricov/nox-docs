#!/usr/bin/env node

const VERSION = "0.0.1"

const HELP = `
nox - starter untuk situs dokumentasi berbasis MDX

Instalasi (di proyek Next.js atau Vite React):

  npm install nox

Perintah di atas menginstal nox beserta paket @nox secara transitif,
sehingga Anda bisa langsung memakai import berikut:

  import { NoxLayout } from "@nox/layouts"
  import type { NoxSidebarMenu } from "@nox/layouts"
  import { NoxRender } from "@nox/render"

Setup manual:

  1. Next.js: tambahkan @nox/core, @nox/layouts, @nox/render ke transpilePackages di next.config.ts

     const nextConfig = {
       transpilePackages: ["@nox/core", "@nox/layouts", "@nox/render"],
     }

  2. Edit root layout (Next.js: app/layout.tsx) untuk memakai NoxLayout
     dan definisikan menu dengan tipe NoxSidebarMenu.

  3. Buat route dokumentasi (Next.js: app/[...docs]/page.tsx) yang
     merender NoxRender dengan dir dan slug dari URL.

  4. Buat folder content dan file MDX (mis. content/docs/index.mdx).

Panduan lengkap tersedia di situs dokumentasi nox.

Perintah:

  nox init       Tampilkan langkah-langkah setup manual
  nox template   Buat proyek dari template (segera hadir)
  nox --version  Tampilkan versi
  nox --help     Tampilkan bantuan ini
`.trim()

function printInit() {
  console.log(`
Setup manual nox:

1. npm install nox
2. Next.js: setel transpilePackages: ["@nox/core", "@nox/layouts", "@nox/render"] di next.config.ts
3. Edit root layout dengan NoxLayout dan NoxSidebarMenu
4. Buat app/[...docs]/page.tsx dengan NoxRender
5. Buat folder content dan file MDX (content/docs/*.mdx)

Import yang tersedia:
  import { NoxLayout } from "@nox/layouts"
  import type { NoxSidebarMenu } from "@nox/layouts"
  import { NoxRender } from "@nox/render"
`.trim())
}

function printTemplate() {
  console.log(
    "Template scaffolding belum tersedia. Gunakan setup manual dengan perintah `nox init`."
  )
}

function main() {
  const command = process.argv[2]

  switch (command) {
    case "init":
      printInit()
      break
    case "template":
      printTemplate()
      break
    case "-v":
    case "--version":
      console.log(VERSION)
      break
    case "-h":
    case "--help":
    case undefined:
      console.log(HELP)
      break
    default:
      console.log(HELP)
  }
}

main()
