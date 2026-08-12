import * as intro from "@clack/prompts"

async function main() {
  // Menampilkan pesan pembuka
  intro.intro("Selamat Datang di CLI Clack!")

  // Meminta input teks dari pengguna
  const nama = await intro.text({
    message: "Siapa nama Anda?",
    placeholder: "Masukkan nama di sini...",
    validate(value) {
      if (value.length === 0) return "Nama tidak boleh kosong!"
    },
  })

  // Meminta konfirmasi (Y/n)
  const setuju = await intro.confirm({
    message: "Apakah Anda ingin melanjutkan?",
  })

  // Menampilkan pesan penutup
  if (setuju) {
    intro.outro(`Halo ${nama}! Setup proyek Clack Anda berhasil.`)
  } else {
    intro.outro("Proses dibatalkan.")
  }
}

main().catch(console.error)
