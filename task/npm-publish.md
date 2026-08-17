# Noxkit - Publish ke npm

## Prasyarat

- Akun npm sudah terdaftar
- Sudah login: `npm login`

## Struktur Paket

| Paket | Path | Nama npm | Fungsi |
|-------|------|----------|--------|
| Library | `packages/nox/` | `noxkit` | Semua komponen, layout, render |
| CLI | `apps/cli/` | `@nox/cli` | Perintah `noxkit init`, `noxkit template` |

## Publish Pertama Kali

### 1. Login ke npm

```bash
npm login
```

### 2. Publish Library (noxkit)

```bash
cd packages/nox
npm publish
```

### 3. Publish CLI (@nox/cli)

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

### Workflow

```
1. Edit file di packages/nox/src/
2. Bump version
3. Publish
```

### Langkah Detail

#### 1. Edit file

```bash
# Contoh: tambah komponen baru
vim packages/nox/src/components/new-component.tsx
```

#### 2. Bump version

```bash
cd packages/nox

# Untuk patch (0.0.1 → 0.0.2)
npm version patch

# Untuk minor (0.0.1 → 0.1.0)
npm version minor

# Untuk major (0.0.1 → 1.0.0)
npm version major
```

#### 3. Publish

```bash
npm publish
```

#### 4. User update

```bash
# User update ke versi terbaru
npm update noxkit
# atau
npm install noxkit@latest
```

### CLI Update

```bash
cd apps/cli
# Edit src/index.ts
npm version patch
npm run build
npm publish
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
