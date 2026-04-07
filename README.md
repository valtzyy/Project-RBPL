# 📦 SMDG (Sistem Manajemen Distribusi Gudang)

SMDG (Sistem Manajemen Distribusi Gudang) adalah aplikasi berbasis web yang dirancang untuk mengelola inventaris, memantau arus barang masuk dan keluar, serta mengoordinasikan distribusi antara pihak gudang, manajemen, dan distributor secara efisien dan *real-time*.

Aplikasi ini dibangun menggunakan arsitektur modern Next.js (App Router) dengan implementasi Server Actions untuk performa maksimal, serta Prisma ORM untuk manajemen *database* yang tangguh.

🔗 **Live Demo:** [https://sandrella-gudang.vercel.app](https://sandrella-gudang.vercel.app)

---

##  Fitur Utama

- **Autentikasi & Otorisasi Fleksibel:** Sistem *login* aman menggunakan Better Auth dengan pemisahan hak akses berbasis peran (Role-Based Access Control) untuk Manajemen, Gudang, dan Distributor.
- **Manajemen Barang Masuk:** Pencatatan stok barang yang masuk dari *supplier* dengan kalkulasi penambahan stok otomatis ke *database* utama. Dilengkapi fitur *edit* dan batalkan (hapus) riwayat.
- **Manajemen Barang Keluar:** Pencatatan distribusi barang dengan validasi stok (mencegah *overselling*) dan pengurangan stok otomatis. 
- **Sinkronisasi Stok Real-time:** Penggunaan *database transaction* memastikan stok gudang selalu akurat setiap kali terjadi penambahan, pengubahan, atau penghapusan log aktivitas.
- **Modul Distribusi Lanjutan:** Pengelolaan fitur spesifik seperti *Purchase Order* (PO), pembuatan *Invoice*, pelacakan status Pengiriman, dan pembuatan Laporan.
- **Desain Responsif:** Antarmuka pengguna yang bersih, modern, dan optimal diakses melalui perangkat *desktop* maupun *mobile*.

---

## Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan *modern tech stack*:

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
- **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Hosted via Prisma Postgres / Neon)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## Cara Menjalankan Secara Lokal (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan *project* ini di komputermu sendiri.

### Prasyarat
Pastikan komputermu sudah ter-install:
- Node.js (versi 18 atau terbaru)
- Git

### 1. Kloning Repository
```bash
git clone [https://github.com/valtzyy/Project-RBPL.git](https://github.com/valtzyy/Project-RBPL.git)
cd Project-RBPL
```

### 2. Install Depedency
```bash
npm install
```

### 3. Konfigurasi Environment Variabel
buat file baru bernama .env di root folder dan isi dengan template sepert ini
```bash
# URL Koneksi Database PostgreSQL (Contoh menggunakan Prisma Postgres/Neon)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Konfigurasi Better Auth
BETTER_AUTH_SECRET="buat_kunci_rahasia_yang_panjang_dan_acak_di_sini"
BETTER_AUTH_URL="http://localhost:3000" # Gunakan localhost untuk pengembangan lokal
```
### 4. Sinkronisasi Database
Kirim struktur tabel (skema) aplikasi ke dalam database:
```bash
npm prisma db push
```
(Opsional) Jika ingin melihat atau mengelola isi database langsung via UI browser:
```bash
npx prisma studio
```
### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka http://localhost:3000 di browsermu untuk melihat hasilnya.
