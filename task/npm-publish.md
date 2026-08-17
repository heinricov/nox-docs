# Noxkit - Publish ke npm

## Prasyarat

- Akun npm sudah terdaftar
- Sudah login: `npm login`

## Struktur Paket

| Paket | Path | Nama npm | Fungsi |
|-------|------|----------|--------|
| Library | `packages/nox/` | `noxkit` | Semua komponen, layout, render |
| CLI | `apps/cli/` | `noxkit-cli` | Perintah `noxkit init`, `noxkit template` |

## Publish Pertama Kali

### 1. Login ke npm

```bash
npm login
```

### 2. Publish Library (noxkit)

```bash
cd packages/nox
npm run release
```

### 3. Publish CLI (noxkit-cli)

```bash
cd apps/cli
npm run build
npm publish
```

### 4. Verifikasi

```bash
# Test di project baru
mkdir test-noxkit && cd test-noxkit
npm init -y
npm install noxkit

# Coba import
node -e "import('noxkit').then(m => console.log(Object.keys(m)))"
```

## Update Setelah Perubahan File

### Satu Perintah (Recommended)

```bash
cd packages/nox

# Patch version (0.0.2 → 0.0.3) + publish
npm run release

# Minor version (0.0.2 → 0.1.0) + publish
npm run release:minor

# Major version (0.0.2 → 1.0.0) + publish
npm run release:major
```

Script `release` otomatis:
1. Bump version di `package.json`
2. Publish ke npm

### Workflow Lengkap

```
1. Edit file di packages/nox/src/
2. npm run release
3. Selesai
```

### CLI Update

```bash
cd apps/cli
# Edit src/index.ts
npm version patch
npm run build
npm publish
```

### User Update

```bash
# User update ke versi terbaru
npm update noxkit
# atau
npm install noxkit@latest
```

## Import Pattern

```ts
// Root import (layouts + render)
import { NoxLayout, NoxRender } from "noxkit"
import type { NoxSidebarMenu, GroupMenuItem } from "noxkit"

// Subpath import (individual components)
import { Button } from "noxkit/components/button"
import { cn } from "noxkit/lib/utils"

// CSS
import "noxkit/globals.css"
```

## Troubleshooting

### Error "Cannot publish over existing version"

```bash
# Cek versi saat ini
npm view noxkit version

# Publish dengan tag beta
npm publish --tag beta
```

### Error "You must be logged in"

```bash
npm login
# Masukkan username, password, email
```

### Error "Package not found"

- Pastikan nama package di `package.json` belum terpakai di npm
- Cek: `npm view noxkit`
