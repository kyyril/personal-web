# Panduan Deployment ke Cloudflare Pages

Dokumen ini menjelaskan cara melakukan deployment proyek Next.js ini ke Cloudflare Pages menggunakan repositori GitHub.

## 1. Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- Akun [GitHub](https://github.com/).
- Akun [Cloudflare](https://dash.cloudflare.com/sign-up).
- Proyek ini sudah di-push ke repositori GitHub pribadi atau publik.

## 2. Membuat Proyek di Cloudflare Pages

1.  **Login ke dasbor Cloudflare** Anda.
2.  Buka **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Pilih repositori GitHub yang berisi proyek Anda dan klik **Begin setup**.

## 3. Konfigurasi Build dan Deployment

Setelah menghubungkan repositori, Anda perlu mengonfigurasi pengaturan build:

- **Production branch**: Pilih branch utama repositori Anda (misalnya, `main` atau `master`).
- **Framework preset**: Pilih **Next.js**. Cloudflare akan secara otomatis mengisi sebagian besar pengaturan.
- **Build command**: `npx prisma generate && npm run build`
- **Build output directory**: Biarkan default (`.next`).

### Variabel Lingkungan (Environment Variables)

Proyek ini menggunakan Prisma dan kemungkinan variabel lingkungan lainnya (misalnya, untuk Kinde Auth, Google Generative AI). Anda **harus** menambahkan variabel ini ke pengaturan Cloudflare Pages agar aplikasi berfungsi dengan benar.

1.  Di halaman ringkasan proyek Anda, buka **Settings** > **Environment variables**.
2.  Tambahkan semua variabel yang ada di file `.env` lokal Anda.
    - **PENTING**: Untuk `DATABASE_URL`, pastikan string koneksi Anda kompatibel dengan driver adapter Prisma untuk Cloudflare D1 atau database lain yang dapat diakses secara publik.
3.  Klik **Save** untuk setiap variabel.

Setelah semua konfigurasi selesai, klik **Save and Deploy**. Cloudflare akan mulai membangun dan melakukan deployment situs Anda.

## 4. Keamanan dan Akses

### Mengamankan Deployment `*.pages.dev`

Secara default, setiap deployment akan dapat diakses melalui URL unik `[nama-proyek].pages.dev`. Untuk mencegah akses publik ke deployment pratinjau (non-produksi), Anda dapat:

1.  Pergi ke **Settings** > **Access policy**.
2.  Buat kebijakan akses yang hanya mengizinkan alamat email atau grup tertentu untuk melihat deployment. Ini sangat berguna untuk lingkungan staging.

### Praktik Terbaik Keamanan

- **Custom Domain**: Gunakan domain kustom untuk situs produksi Anda dan manfaatkan fitur keamanan Cloudflare seperti **SSL/TLS**, **WAF (Web Application Firewall)**, dan **Bot Fight Mode**.
- **Turnstile**: Tambahkan [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) ke formulir (seperti di halaman Guestbook) untuk melindungi dari spam dan bot tanpa menggunakan CAPTCHA.
- **Headers**: Atur header keamanan kustom di file `next.config.mjs` atau melalui file `_headers` di direktori `public` untuk memperkuat keamanan (misalnya, Content Security Policy).

## 5. Mengakses Situs Anda

- **URL Produksi**: Setelah deployment pertama berhasil, situs Anda akan tersedia di `[nama-proyek].pages.dev`.
- **Deployment Pratinjau**: Setiap kali Anda mendorong commit baru ke branch yang terhubung, Cloudflare akan secara otomatis membuat deployment pratinjau dengan URL uniknya sendiri.

Dengan mengikuti panduan ini, proyek Anda akan berhasil di-deploy ke Cloudflare Pages dengan konfigurasi yang aman.