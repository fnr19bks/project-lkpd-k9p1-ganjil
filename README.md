# 🎮 LKPD Digital — Graf: Representasi Masalah dan Navigasi

Aplikasi web interaktif (game edukasi) untuk **Lembar Kerja Peserta Didik (LKPD)**
mata pelajaran Informatika Kelas 8 — materi **Berpikir Komputasional: Graf**.

Dibuat dengan **HTML5 + CSS3 + Vanilla JavaScript (ES6)**. Tanpa library/framework eksternal.

---

## 📁 Isi Folder

Pastikan **6 file** berikut berada dalam **satu folder yang sama**:

| No | Nama File      | Fungsi                                                    | Wajib? |
|----|----------------|-----------------------------------------------------------|--------|
| 1  | `index.html`   | Struktur halaman, kanvas, dan formulir                    | ✅ Ya  |
| 2  | `style.css`    | Desain UI, animasi, dan gaya cetak (print)                | ✅ Ya  |
| 3  | `script.js`    | Logika game, interaksi kanvas, validator, dwibahasa       | ✅ Ya  |
| 4  | `logo.png`     | Logo sekolah untuk header                                 | ✅ Ya  |
| 5  | `favicon.svg`  | Ikon kecil di tab browser                                 | ✅ Ya  |
| 6  | `README.md`    | Panduan ini                                               | ⬜ Opsional |

> ⚠️ **Penting:** Nama file harus **persis sama** (huruf kecil semua, kecuali `README.md`).
> Jika nama logo Anda berbeda (misal `Logo.png`), ubah juga pada `index.html` baris:
> `<img src="logo.png" alt="Logo SMPN 19 Bekasi" class="logo" />`

---

## 🧪 Cara Menjalankan di Komputer (Lokal)

1. Simpan semua file dalam satu folder, misalnya `lkpd-graf`.
2. Klik dua kali file **`index.html`**.
3. Halaman akan terbuka di browser (Chrome, Edge, Firefox, atau Safari).
4. Selesai! Tidak perlu instalasi apa pun.

> 💡 **Tips:** Jika logo tidak muncul, pastikan file bernama `logo.png` benar-benar ada
> di folder yang sama dan formatnya benar-benar PNG.

---

## 🌐 Cara Mengonlinekan dengan GitHub Pages (GRATIS)

Panduan ini ditulis untuk **pemula total**. Ikuti langkahnya satu per satu.

---

### LANGKAH 1 — Membuat Akun GitHub

1. Buka browser, kunjungi **https://github.com**.
2. Klik tombol **Sign up** di kanan atas.
3. Masukkan **email** aktif Anda → klik **Continue**.
4. Buat **password** yang kuat → klik **Continue**.
5. Buat **username** (nama pengguna), misalnya `guru-informatika-smpn19`.
   - Username hanya boleh huruf, angka, dan tanda hubung (`-`).
6. Ketik `n` atau `y` untuk menerima email promosi (bebas pilih apa saja) → klik **Continue**.
7. Selesaikan verifikasi "puzzle" (teka-teki gambar) → klik **Submit**.
8. Buka email Anda, cari email dari GitHub, salin **kode verifikasi 8 digit**,
   lalu tempel di halaman GitHub → klik **Enter**.
9. Jika muncul halaman pertanyaan tambahan, klik **Skip personalization** (lewati).
10. Selesai! Anda sekarang punya akun GitHub.

---

### LANGKAH 2 — Membuat Repository Baru

Repository (repo) = "folder online" tempat menyimpan file Anda.

1. Setelah login, klik ikon **➕** di kanan atas → pilih **New repository**.
   - Atau langsung buka: **https://github.com/new**
2. Isi kolom **Repository name** dengan: `lkpd-graf`
   (boleh nama lain, tapi **tanpa spasi** — gunakan tanda hubung).
3. Pilih **Public** ✅
   *(WAJIB Public agar GitHub Pages gratis bisa aktif).*
4. Pada bagian **Initialize this repository with**, biarkan semua **tidak dicentang**.
   - ❌ Jangan centang "Add a README file"
   - ❌ Jangan pilih .gitignore
   - ❌ Jangan pilih license
5. Klik tombol hijau **Create repository**.
6. Anda akan diarahkan ke halaman kosong berisi instruksi Git.
   **Abaikan semua perintah Git di halaman itu** — kita akan pakai cara upload langsung.

---

### LANGKAH 3 — Mengunggah Semua File

1. Di halaman repository yang baru dibuat, klik tautan **uploading an existing file**
   (ada di tengah halaman), atau klik tombol **Add file** → **Upload files**.
2. Buka folder `lkpd-graf` di komputer Anda.
3. **Pilih semua file berikut** (blok semuanya dengan mouse, atau tekan `Ctrl + A`
   di dalam folder), lalu **tarik (drag & drop)** ke area upload di halaman GitHub:
   - `index.html`
   - `style.css`
   - `script.js`
   - `logo.png`
   - `favicon.svg`
   - `README.md`
4. Tunggu sampai semua file selesai terunggah (muncul daftar nama file di halaman).
5. Scroll ke bawah ke kotak **Commit changes**.
6. Isi kolom deskripsi dengan: `Upload file LKPD Graf`
7. Pastikan pilihan **Commit directly to the main branch** terpilih.
8. Klik tombol hijau **Commit changes**.

✅ Sekarang semua file sudah ada di GitHub.

> 🔎 **Cek:** Setelah selesai, Anda akan melihat daftar file di repository.
> Pastikan ada `index.html`, `style.css`, `script.js`, `logo.png`, dan `favicon.svg`.

---

### LANGKAH 4 — Mengaktifkan GitHub Pages

1. Di halaman repository, klik tab **Settings** (ikon gerigi ⚙️, di menu atas).
   - Jika tidak terlihat, klik ikon `⋯` dulu untuk membuka menu tambahan.
2. Di **menu kiri**, scroll ke bawah dan klik **Pages**
   (di bawah kelompok "Code and automation").
3. Pada bagian **Build and deployment** → **Source**:
   - Pastikan terpilih **Deploy from a branch**.
4. Pada bagian **Branch**:
   - Klik dropdown yang semula bertuliskan `None` → pilih **main**.
   - Di dropdown sebelahnya, biarkan **/ (root)**.
5. Klik tombol **Save**.
6. Tunggu **1–3 menit**. Refresh halaman (tekan `F5`).
7. Akan muncul kotak hijau bertuliskan:
   > *Your site is live at https://username-anda.github.io/lkpd-graf/*

---

### LANGKAH 5 — Menemukan URL Akhir & Membagikan ke Siswa

URL situs Anda memiliki pola:
