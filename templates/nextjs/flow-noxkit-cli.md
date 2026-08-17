# Flow Noxkit CLI

membuat project template yang sudah include nextjs dan noxkit.

perintah: npx create-noxkit-app@latest
flow:

1. ketika perintah "npx create-noxkit-app@latest" dijalankan tampilkan pertanyaan : "What is your project named?"å
   dengan tampilan seperti ini : "What is your project named? › my-app"
2. pada bagian "> my-app" bisa diisi dengan nama project yang diinginkan.
3. setelah di enter ada pilihan nextjs atau nextjs + shadcn-ui.

## Pilihan nextjs

1. setelah di enter pilihan nextjs.
2. setelah itu saat di enter, masuk ke proses create nextjs project dengan printah "npx create-next-app@latest"
   yang didalam nya meminta nama project yang diisi di bagian "> my-app" di proses sebelumnya.
3. lalu otomatis memilih yes untuk use recommended defaultsetup yang ada di nextjs.
4. saat proses 3 dan 4 berjalan tampilan cli hanya akan menampilkan progress.
5. setelah proses selesai, tampilan cli akan menampilkan pesan "Next.js process completed successfully."
6. setelah itu, masuk ke proses selanjutnya menjalankan printah "npm install noxkit@latest".
7. setelah itues selesai, tampilan cli akan menampilkan pesan "Noxkit process completed successfully."
8. lalu ada pesan "cd my-app" untuk masuk ke direktori project yang baru dibuat, "npm run dev" untuk menjalankan project.

## Pilihan nextjs + shadcn-ui

1. setelah di enter pilihan nextjs + shadcn-ui.
2. muncul pertanyaan : "what use preset? > b1tMbMCuW", default nya "b1tMbMCuW" namun bisa di ganti dengan masuk ke dokumentasi shadcn-ui.
3. setelah di enter otomatis menjalankan perintah "npx create-next-app@latestnpx shadcn@latest init --preset b1tMbMCuW --template next --pointer", jika presetnya  
   tidak di rubah maka default nya "--preset b1tMbMCuW" namun jika di rubah "--preset \_\_\_" mengikuti preset yang di inputkan.
4. saat proses 3 berjalan tampilan cli hanya akan menampilkan progress.
5. setelah proses selesai, tampilan cli akan menampilkan pesan "Next.js & Shadcn-ui process completed successfully."
6. setelah itu, masuk ke proses selanjutnya menjalankan printah "npm install noxkit@latest".
7. setelah itues selesai, tampilan cli akan menampilkan pesan "Noxkit process completed successfully."
8. lalu ada pesan "cd my-app" untuk masuk ke direktori project yang baru dibuat, "npm run dev" untuk menjalankan project.

semua proses ini menghasilkan :

1. project nextjs versi paling baru.
2. file "next.config.ts" sudah di update dengan file [next.config.ts.template](next.config.ts.template).
3. file "globals.css" sudah di update dengan file [globals.css.template](app/globals.css.template) jika menggunakan shadcn-ui maka tambahkan
   "@import 'noxkit/globals.css';" di baris ke 4.
4. app/layout.tsx sudah di update dengan file [layout.tsx.template](app/layout.tsx.template).
5. dibutkan "app/[...docs]/page.tsx" untuk menampilkan halaman docs.
   dengan file [page.tsx.template](app/[...docs]/page.tsx.template).
6. dibuatkan "content/docs/index.mdx" untuk menampilkan halaman docs.
   dengan file [index.mdx.template](content/docs/index.mdx.template).
