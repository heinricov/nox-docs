#!/usr/bin/env node

const VERSION = "0.0.1"

const HELP = `
noxkit - starter untuk situs dokumentasi berbasis MDX

Instalasi (di proyek Next.js atau Vite React):

  npm install noxkit

Perintah di atas menginstal noxkit, sehingga Anda bisa langsung memakai import berikut:

  import { NoxLayout, NoxRender } from "noxkit"
  import type { NoxSidebarMenu } from "noxkit"

Setup manual:

  1. Next.js: tambahkan noxkit ke transpilePackages di next.config.ts

     const nextConfig = {
       transpilePackages: ["noxkit"],
     }

  2. Edit root layout (Next.js: app/layout.tsx) untuk memakai NoxLayout
     dan definisikan menu dengan tipe NoxSidebarMenu.

  3. Buat route dokumentasi (Next.js: app/[...docs]/page.tsx) yang
     merender NoxRender dengan dir dan slug dari URL.

  4. Buat folder content dan file MDX (mis. content/docs/index.mdx).

Panduan lengkap tersedia di situs dokumentasi noxkit.

Perintah:

  noxkit init       Tampilkan langkah-langkah setup manual
  noxkit template   Buat proyek dari template (segera hadir)
  noxkit --version  Tampilkan versi
  noxkit --help     Tampilkan bantuan ini
`.trim()

function printInit() {
  console.log(`
Setup manual noxkit:

1. npm install noxkit
2. Next.js: setel transpilePackages: ["noxkit"] di next.config.ts
3. Edit root layout dengan NoxLayout dan NoxSidebarMenu
4. Buat app/[...docs]/page.tsx dengan NoxRender
5. Buat folder content dan file MDX (content/docs/*.mdx)

Import yang tersedia:
  import { NoxLayout, NoxRender } from "noxkit"
  import type { NoxSidebarMenu } from "noxkit"
`.trim())
}

function printTemplate() {
  console.log(
    "Template scaffolding belum tersedia. Gunakan setup manual dengan perintah `noxkit init`."
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
