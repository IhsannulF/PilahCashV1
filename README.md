# PilahCash — Platform Daur Ulang Sampah Kemasan Coffee Shop

> **Tagline:** *"Membuat sampah bernilai, tanpa ribet — setor sampah, dapat uang, transparan."*  
> **Kompetisi:** 10th IndonesiaNEXT Hackathon by Telkomsel 2026 — Tahap Final  
> **Repository:** [github.com/IhsannulF/PilahCashV1](https://github.com/IhsannulF/PilahCashV1)

---

## 🍃 Latar Belakang & Permasalahan

Coffee shop skala kecil hingga menengah menghasilkan sampah kemasan operasional dalam volume tinggi setiap harinya — kaleng susu kental manis (SKM), botol sirup kaca, kemasan kopi UHT, dus kardus dari supplier, hingga ampas kopi. Penyaluran sampah selama ini terkendala karena:
- Pemilik/staf coffee shop tidak tahu atau tidak sempat mencari pengepul yang rutin dan terpercaya.
- Proses penyaluran masih manual (telepon-teleponan, negosiasi harga tanpa standar transparan).
- Tidak ada data jejak digital mengenai nilai ekonomi dari sampah yang dihasilkan.

**PilahCash** hadir sebagai platform B2B yang menghubungkan coffee shop dengan mitra pengepul daur ulang secara digital, transparan, dan terjadwal dalam waktu **< 2 menit**, tanpa memerlukan hardware/timbangan pintar mahal di fase awal.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/) dengan Design System *Kraft & Canopy* (`#16301F` Forest Dark, `#C7F13B` Lime Accent, `#F6F2E7` Kraft Base)
- **Tipografi:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Display/Nominal), [Inter](https://fonts.google.com/specimen/Inter) (Body/UI), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Data/Kode)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage + Row Level Security)
- **Visualisasi Data:** [Recharts](https://recharts.org/)
- **Generator QR Code:** `qrcode.react`
- **Form & Validasi:** React Hook Form + Zod

---

## ✨ Fitur Utama Berdasarkan Role

### ☕ 1. Coffee Shop (`coffee_shop`)
- **Pengajuan Setor Sampah (< 2 Menit):** Pilih kategori sampah kemasan, estimasi berat, dan metode penyaluran:
  - **Setor Langsung (Drop Point):** Tanpa minimal berat, komisi 0%.
  - **Dijemput Mitra (Pickup):** Minimal 2kg, potongan biaya layanan 15%.
- **Struk Digital & Kode QR:** Setiap pengajuan menghasilkan kode transaksi unik & QR Code untuk diverifikasi petugas.
- **Konfirmasi Dua Arah:** Coffee shop mengonfirmasi hasil timbangan petugas sebelum saldo resmi bertambah secara atomik.
- **Dashboard Pendapatan & Dampak:** Card ringkasan total saldo, statistik total berat kg, badge gamifikasi (*Pahlawan Hijau*), dan grafik pecahan per kategori.
- **Penarikan Saldo (Withdrawal):** Pengajuan pencairan saldo ke rekening bank (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, DANA).

### 🚚 2. Petugas Pengepul (`pengepul`)
- **Pencarian / Scan QR Code:** Membuka detail pengajuan setoran coffee shop lewat scan/input kode transaksi.
- **Input Timbangan Itemized:** Menginput berat aktual per kategori sampah secara transparan.
- **Perhitungan Otomatis:** Sistem otomatis menghitung total kotor (gross), potongan komisi dijemput, dan nominal bersih (net).

### 🛡️ 3. Admin Platform (`admin`)
- **Pengelolaan Kategori & Tarif (CRUD):** Mengatur harga patokan per kg untuk tiap kategori daur ulang.
- **Kelola Mitra Pengepul:** Mengatur status verifikasi dan aktivitas pengepul mitra.
- **Monitoring Platform:** Memantau seluruh arus transaksi setoran dan penarikan saldo di platform.

---

## 📂 Struktur Direktori Proyek

```text
PilahCash/
├── app/
├── admin/               # Halaman Admin (kategori, mitra, transaksi)
├── dashboard/           # Dashboard utama Coffee Shop
├── login/               # Halaman Autentikasi Login
├── pengepul/            # Dashboard & Form Penimbangan Pengepul
├── register/            # Halaman Pendaftaran Mitra
├── riwayat/             # List Riwayat Transaksi Setoran
├── saldo/               # Manajemen Dompet & Penarikan Saldo
├── setor/               # Form Submission & Detail Struk QR
├── globals.css          # Design System CSS Variables & Utility Classes
├── layout.tsx           # Google Fonts Setup (Space Grotesk, Inter, JetBrains Mono)
└── page.tsx             # Landing Page Utama PilahCash
├── components/
├── dashboard/           # BalanceCard, CategoryBreakdownChart, HistoryList
├── forms/               # SubmissionForm, WeighingForm, WithdrawalForm
└── shared/              # Navbar, RoleSwitcher, StatusBadge, TransactionTicketCard, QRDisplay
├── lib/
├── store/mock-store.ts  # In-memory Store & Demo Data
├── supabase/            # Client, Server & Middleware SSR Helpers
├── utils/               # Kalkulator Pricing & Generator Kode Transaksi
└── validators/          # Schema Validasi Zod
├── supabase/
└── schema.sql           # Schema SQL Postgres (Tabel, RLS Policies, Seed Data)
├── types/
└── database.types.ts    # Tipe TypeScript Data Models
├── design.md            # Dokumentasi Design System (Kraft & Canopy)
├── prd.md               # Product Requirement Document (PRD)
└── spec.md              # Technical Specification Document
```

---

## 🚀 Cara Menjalankan Proyek di Lokal

### 1. Clone Repository
```bash
git clone https://github.com/IhsannulF/PilahCashV1.git
cd PilahCashV1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env.local`)
Buat atau perbarui file `.env.local` di root proyek:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 4. Menyiapkan Database Supabase (SQL Schema)
1. Buka dashboard [Supabase](https://supabase.com) Anda -> masuk ke **SQL Editor**.
2. Salin seluruh isi file [`supabase/schema.sql`](supabase/schema.sql).
3. Paste dan klik **Run** untuk membuat tabel, fungsi RLS, dan seed data awal.

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📝 Lisensi & Kredit

Proyek ini dibangun khusus untuk tahap final **10th IndonesiaNEXT Hackathon by Telkomsel 2026** oleh Tim PilahCash.
