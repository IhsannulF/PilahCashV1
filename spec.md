# Technical Spec — PilahCash

**Stack:** Next.js 14+ (App Router) · TypeScript (strict) · Tailwind CSS · shadcn/ui (Radix UI primitives) · Supabase (Postgres + Auth + Storage + Realtime) · Deploy: Vercel

---

## 1. Problem Statement

Coffee shop skala kecil–menengah menghasilkan sampah kemasan operasional (kaleng, botol, dus, plastik) dalam volume tinggi tapi kesulitan menyalurkannya ke pengepul karena proses masih manual, tidak transparan, dan tidak terjadwal. Pengepul di sisi lain kesulitan mendapat sumber sampah yang konsisten. PilahCash menjadi platform penghubung dua belah pihak dengan alur setor–timbang–konfirmasi–bayar yang transparan dan terekam digital.

## 2. Goals and Non-Goals

**Goals:**
- Alur pengajuan setoran sampah oleh coffee shop dalam ≤ 4 langkah.
- Matching otomatis/manual-assist ke pengepul mitra.
- Perhitungan nominal otomatis & transparan berbasis kategori + berat.
- Dashboard riwayat & pendapatan sampah real-time bagi coffee shop.
- Sistem MVP tanpa dependensi hardware IoT.

**Non-Goals (di luar scope MVP):**
- Integrasi IoT/timbangan pintar.
- Payment gateway otomatis (disbursement real ke rekening).
- Aplikasi native mobile.
- Algoritma optimasi rute armada penjemputan.

## 3. Functional Requirements

Lihat tabel FR-1 s/d FR-16 pada `prd.md`. Ringkasan modul teknis yang harus dibangun:

1. **Auth Module** — register/login/logout, role-based access (coffee_shop, pengepul, admin), protected routes via middleware.
2. **Submission Module** — form pengajuan setoran (kategori, estimasi berat, metode setor), generate kode transaksi unik + QR code.
3. **Matching Module** — assign transaksi Dijemput ke pengepul mitra tersedia (MVP: assignment manual oleh admin/petugas pengambil job dari daftar, bukan algoritma geolokasi kompleks).
4. **Weighing & Confirmation Module** — petugas input berat aktual → sistem hitung nominal → coffee shop konfirmasi → status `completed`.
5. **Wallet Module** — saldo bertambah otomatis saat transaksi `completed`, riwayat mutasi, request penarikan.
6. **History & Dashboard Module** — list riwayat transaksi + card ringkasan (total pendapatan, total berat, breakdown per kategori).
7. **Gamification Module** — hitung progress bulanan, unlock badge berdasarkan rule sederhana (mis. total berat/transaksi per bulan).
8. **Admin Module** — CRUD kategori & tarif, kelola status mitra pengepul, monitoring seluruh transaksi.

## 4. Technical Architecture

```
┌─────────────────────────────┐
│        Next.js (Vercel)     │
│  App Router + Server Actions│
│  ┌────────────┐ ┌─────────┐ │
│  │ Route      │ │ API     │ │
│  │ Handlers   │ │ Routes  │ │
│  └────────────┘ └─────────┘ │
└──────────────┬───────────────┘
               │ supabase-js (SSR client + browser client)
               ▼
┌─────────────────────────────┐
│           Supabase           │
│  Postgres (RLS enabled)      │
│  Auth (email/password)       │
│  Storage (bukti foto sampah) │
│  Realtime (status transaksi) │
└───────────────────────────────┘
```

- **Rendering strategy:** Server Components untuk data-fetch awal (dashboard, riwayat), Client Components untuk form interaktif (submission form, weighing form) dengan Server Actions untuk mutasi data.
- **Auth:** Supabase Auth dengan `@supabase/ssr` — session disimpan di cookie, middleware Next.js memverifikasi role sebelum mengizinkan akses ke `/coffee-shop/*`, `/pengepul/*`, `/admin/*`.
- **State management:** React Server Components + minimal client state (React Context untuk user session, tidak perlu state management library eksternal di MVP).
- **Realtime:** Supabase Realtime channel pada tabel `transactions` agar coffee shop melihat perubahan status (mis. petugas sudah input berat) tanpa refresh manual.
- **QR Code:** generate di client dengan library `qrcode.react`, berisi `transaction_code`.

## 5. File Structure

```
pilahcash/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (coffee-shop)/
│   │   ├── dashboard/page.tsx
│   │   ├── setor/
│   │   │   ├── page.tsx                # form pengajuan setoran
│   │   │   └── [transactionId]/page.tsx # detail + QR
│   │   ├── riwayat/page.tsx
│   │   └── saldo/page.tsx
│   ├── (pengepul)/
│   │   ├── dashboard/page.tsx           # daftar job/penjemputan
│   │   └── transaksi/[transactionId]/page.tsx # input berat & konfirmasi
│   ├── (admin)/
│   │   ├── kategori/page.tsx
│   │   ├── mitra/page.tsx
│   │   └── transaksi/page.tsx
│   ├── api/
│   │   ├── transactions/route.ts
│   │   ├── transactions/[id]/route.ts
│   │   ├── transactions/[id]/confirm/route.ts
│   │   └── webhooks/                    # reserved untuk fase lanjutan
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                              # shadcn/ui generated components
│   ├── forms/
│   │   ├── submission-form.tsx
│   │   └── weighing-form.tsx
│   ├── dashboard/
│   │   ├── balance-card.tsx
│   │   ├── history-list.tsx
│   │   └── category-breakdown-chart.tsx
│   └── shared/
│       ├── qr-display.tsx
│       └── status-badge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # browser client
│   │   ├── server.ts                    # server client (SSR)
│   │   └── middleware.ts
│   ├── actions/                         # server actions
│   │   ├── submission.ts
│   │   ├── weighing.ts
│   │   └── wallet.ts
│   ├── validators/                      # zod schemas
│   └── utils/
│       ├── pricing.ts                   # kalkulasi nominal & komisi
│       └── transaction-code.ts
├── types/
│   └── database.types.ts                # generated via supabase gen types
├── middleware.ts
├── tailwind.config.ts
└── spec.md / prd.md
```

## 6. Data Models

Skema Postgres (Supabase), semua tabel berelasi ke `auth.users` via `profiles`.

```sql
-- profiles: extends auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('coffee_shop', 'pengepul', 'admin')),
  business_name text not null,
  phone text,
  address text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

-- waste_categories
create table waste_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,                 -- Plastik, Kertas, Logam, Organik, Kaca, Residu
  price_per_kg numeric(12,2) not null,
  icon text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- transactions (setoran)
create table transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_code text not null unique,          -- kode/QR
  coffee_shop_id uuid not null references profiles(id),
  pengepul_id uuid references profiles(id),        -- null sampai matched
  method text not null check (method in ('setor_langsung', 'dijemput')),
  status text not null default 'pending'
    check (status in ('pending', 'matched', 'weighed', 'completed', 'cancelled', 'disputed')),
  estimated_weight_kg numeric(10,2),
  actual_weight_kg numeric(10,2),
  gross_amount numeric(12,2),                     -- berat x tarif sebelum potongan
  commission_amount numeric(12,2),                -- potongan platform/dijemput
  net_amount numeric(12,2),                       -- yang masuk saldo coffee shop
  scheduled_at timestamptz,
  weighed_at timestamptz,
  confirmed_at timestamptz,
  cancelled_reason text,
  created_at timestamptz not null default now()
);

-- transaction_items: breakdown per kategori dalam satu transaksi
create table transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  category_id uuid not null references waste_categories(id),
  weight_kg numeric(10,2) not null check (weight_kg > 0),
  subtotal numeric(12,2) not null
);

-- wallets
create table wallets (
  coffee_shop_id uuid primary key references profiles(id),
  balance numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

-- wallet_transactions: mutasi saldo (audit trail)
create table wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  coffee_shop_id uuid not null references profiles(id),
  transaction_id uuid references transactions(id),
  type text not null check (type in ('credit', 'withdrawal')),
  amount numeric(12,2) not null,
  status text not null default 'success'
    check (status in ('pending', 'success', 'failed')),
  created_at timestamptz not null default now()
);

-- withdrawal_requests
create table withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  coffee_shop_id uuid not null references profiles(id),
  amount numeric(12,2) not null check (amount > 0),
  bank_account text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

-- badges & user_badges (gamifikasi)
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,                 -- "Pahlawan Hijau"
  description text,
  rule_type text not null,            -- 'monthly_weight' | 'monthly_transactions'
  rule_threshold numeric(12,2) not null
);

create table user_badges (
  id uuid primary key default gen_random_uuid(),
  coffee_shop_id uuid not null references profiles(id),
  badge_id uuid not null references badges(id),
  period text not null,               -- '2026-08'
  earned_at timestamptz not null default now(),
  unique (coffee_shop_id, badge_id, period)
);
```

**Entity Relationship (ringkas):**
`profiles (1) —(N) transactions —(N) transaction_items —(1) waste_categories`
`profiles (1) —(1) wallets —(N) wallet_transactions`
`profiles (1) —(N) withdrawal_requests`
`profiles (1) —(N) user_badges —(1) badges`

## 7. API / Endpoints

MVP menggunakan campuran **Server Actions** (untuk mutasi dari form) dan **Route Handlers** (untuk kebutuhan fetch terstruktur/realtime/webhook masa depan).

| Method | Endpoint / Action | Deskripsi | Role |
|---|---|---|---|
| POST | `actions/submission.createSubmission` | Coffee shop membuat pengajuan setoran baru | coffee_shop |
| GET | `/api/transactions?status=&page=` | List transaksi (filter by status, paginated) | coffee_shop, pengepul, admin |
| GET | `/api/transactions/[id]` | Detail satu transaksi | owner / assigned pengepul / admin |
| POST | `actions/weighing.assignPengepul` | Assign transaksi ke pengepul (matching) | admin / sistem otomatis sederhana |
| POST | `actions/weighing.submitWeight` | Petugas input berat per kategori | pengepul |
| POST | `/api/transactions/[id]/confirm` | Coffee shop konfirmasi transaksi final | coffee_shop |
| POST | `actions/wallet.requestWithdrawal` | Coffee shop mengajukan penarikan saldo | coffee_shop |
| GET | `actions/wallet.getBalance` | Ambil saldo & riwayat mutasi | coffee_shop |
| POST | `actions/admin.upsertCategory` | Admin tambah/edit kategori & tarif | admin |
| POST | `actions/admin.updatePartnerStatus` | Admin approve/suspend pengepul | admin |
| GET | `/api/dashboard/summary` | Ringkasan total pendapatan & berat per periode | coffee_shop |

## 8. Business Logic

**Perhitungan nominal per item:**
```
subtotal_kategori = berat_kg × price_per_kg (kategori)
gross_amount = Σ subtotal_kategori (semua kategori dalam transaksi)

jika method == 'dijemput':
    commission_rate = 0.15 s/d 0.20   (ditentukan admin, default 0.15)
    commission_amount = gross_amount × commission_rate
else: // setor_langsung
    commission_amount = 0

net_amount = gross_amount - commission_amount
```

**State machine transaksi:**
```
pending → matched → weighed → completed
   │                              
   └──────────────► cancelled (dari pending/matched, sebelum weighed)
              weighed ──────► disputed (jika coffee shop menolak konfirmasi)
```

- Saldo (`wallets.balance`) hanya bertambah saat status berubah menjadi `completed`, melalui trigger/Server Action yang menulis satu baris ke `wallet_transactions` (type `credit`) dan meng-update `wallets.balance` dalam satu transaksi database (atomic).
- Badge dihitung via scheduled job (Supabase Edge Function + `pg_cron`) setiap akhir bulan, mengevaluasi total berat/jumlah transaksi per `coffee_shop_id` terhadap `badges.rule_threshold`.
- Minimal berat untuk metode Dijemput (2kg) divalidasi di level Server Action sebelum status bisa berubah dari `pending` ke `matched`.

## 9. Edge Cases

| Kasus | Penanganan |
|---|---|
| Berat aktual berbeda jauh dari estimasi awal | Sistem tetap memakai berat aktual untuk perhitungan; selisih besar (>30%) memicu flag `needs_review` yang tampil di panel admin |
| Coffee shop tidak merespons konfirmasi dalam 24 jam | Transaksi otomatis dianggap `completed` (auto-confirm) via scheduled job, dengan notifikasi bahwa auto-confirm telah terjadi |
| Coffee shop menolak konfirmasi (nominal dianggap salah) | Status menjadi `disputed`, transaksi masuk antrian admin untuk mediasi manual |
| Tidak ada pengepul mitra tersedia untuk metode Dijemput di area tersebut | Transaksi tetap `pending` dengan notifikasi "menunggu mitra", admin dapat assign manual atau sarankan Setor Langsung |
| Berat di bawah minimum 2kg untuk metode Dijemput | Validasi ditolak di form sebelum submit, sarankan metode Setor Langsung |
| Kategori sampah dinonaktifkan admin saat ada transaksi pending yang memakainya | Kategori tetap tampil read-only pada transaksi lama, tapi tidak muncul di form submission baru |
| Duplicate submission (double click / retry network) | `transaction_code` di-generate server-side dengan constraint unique; client mengirim idempotency key opsional untuk mencegah duplikasi |
| Saldo tidak cukup saat request withdrawal | Validasi `amount <= wallets.balance` sebelum insert `withdrawal_requests`; ditolak dengan pesan jelas jika melebihi |
| Petugas pengepul tidak aktif/di-suspend saat masih punya transaksi assigned | Transaksi tersebut di-reassign otomatis ke antrian `pending` untuk di-assign ulang oleh admin |

## 10. Validation Rules

- **Email & password** (register): email format valid, password minimal 8 karakter.
- **business_name**: wajib diisi, 3–100 karakter.
- **estimated_weight_kg / actual_weight_kg**: harus > 0, maksimal 2 desimal.
- **method == 'dijemput'** → `actual_weight_kg` (atau total estimasi) wajib ≥ 2 kg.
- **transaction_items**: minimal 1 item per transaksi, `category_id` harus merujuk kategori dengan `is_active = true` pada saat submission dibuat.
- **withdrawal amount**: harus > 0 dan ≤ saldo saat ini; `bank_account` wajib diisi dan divalidasi format dasar (angka, 8–20 digit).
- **commission_rate** (admin config): harus dalam rentang 0.15–0.20 sesuai kebijakan produk.
- Semua input form divalidasi dengan **Zod schema** di client (react-hook-form + zodResolver) dan **divalidasi ulang di Server Action** (jangan percaya validasi client saja).

## 11. Error Handling

- **Pola respons konsisten:** setiap Server Action mengembalikan `{ success: boolean, data?, error?: { code, message } }`, sehingga UI dapat menampilkan toast error yang konsisten (via shadcn/ui `sonner`/`toast`).
- **Database errors:** constraint violation (mis. unique `transaction_code`) ditangkap dan di-retry generate kode baru maksimal 3x sebelum melempar error ke user.
- **Auth errors:** session expired → redirect ke `/login` dengan pesan "Sesi berakhir, silakan login kembali", middleware menangani ini secara global.
- **RLS violation / unauthorized access:** Supabase akan mengembalikan array kosong atau error permission; API/Server Action harus membedakan "data tidak ditemukan" vs "tidak punya akses" dan menampilkan pesan generik (tidak membocorkan detail internal) untuk kasus akses ilegal.
- **Network/timeout errors:** form submission menampilkan state `loading` dan disable double-submit; jika gagal, tampilkan opsi "Coba lagi" tanpa kehilangan input yang sudah diisi user.
- **Logging:** error tak terduga di Server Actions dicatat via `console.error` terstruktur (bisa diarahkan ke Vercel Logs / Sentry di fase lanjutan) tanpa mengekspos stack trace ke client.

## 12. Testing Strategy

| Level | Tools | Cakupan |
|---|---|---|
| **Unit** | Vitest | Fungsi pricing (`lib/utils/pricing.ts`), generator kode transaksi, Zod schema validators |
| **Integration** | Vitest + Supabase local (Docker) atau test project | Server Actions end-to-end terhadap database test (create submission → assign → weigh → confirm → wallet updated) |
| **Component** | React Testing Library | Form submission, weighing form, status badge rendering sesuai state |
| **E2E** | Playwright | Alur kritikal: (1) coffee shop register → submit setoran → lihat QR, (2) petugas input berat → coffee shop konfirmasi → saldo bertambah, (3) admin ubah tarif kategori |
| **RLS/Security** | SQL test script via `psql` terhadap Supabase local | Pastikan coffee shop A tidak bisa membaca transaksi coffee shop B; pengepul hanya melihat transaksi yang di-assign padanya |

**Target sebelum submit final:** semua alur "Must" pada Functional Requirements (FR-1 s/d FR-11, FR-13) memiliki minimal satu E2E test yang lulus.

## 13. Acceptance Criteria

- [ ] Coffee shop dapat register, login, dan logout tanpa error.
- [ ] Coffee shop dapat mengajukan setoran dengan memilih ≥1 kategori sampah dan metode setor, lalu menerima kode/QR transaksi unik.
- [ ] Sistem menolak pengajuan metode Dijemput dengan berat estimasi < 2kg, dengan pesan error yang jelas.
- [ ] Transaksi Dijemput dapat di-assign ke pengepul (baik otomatis maupun manual oleh admin).
- [ ] Petugas pengepul dapat mencari transaksi via kode, menginput berat aktual per kategori, dan sistem menghitung nominal secara otomatis dan benar (termasuk potongan komisi bila metode Dijemput).
- [ ] Coffee shop menerima update status (idealnya realtime) dan dapat mengonfirmasi transaksi, setelah itu saldo bertambah sesuai `net_amount`.
- [ ] Dashboard Riwayat Sampah menampilkan seluruh transaksi milik coffee shop tersebut, terurut dari terbaru, dengan status yang akurat.
- [ ] Dashboard Total Pendapatan menampilkan akumulasi saldo dan breakdown per kategori sesuai data transaksi `completed`.
- [ ] Coffee shop dapat mengajukan penarikan saldo dan tidak bisa menarik melebihi saldo yang tersedia.
- [ ] Admin dapat menambah/mengedit kategori sampah beserta tarifnya, dan perubahan ini langsung berlaku pada submission baru.
- [ ] RLS terverifikasi: satu coffee shop tidak dapat mengakses data transaksi/saldo milik coffee shop lain.
- [ ] Aplikasi ter-deploy dan dapat diakses publik via URL Vercel, terhubung ke Supabase production project.

## 14. Step-by-Step Implementation Plan

**Minggu 1 — Setup & Foundation**
1. Inisialisasi repo Next.js + TypeScript, konfigurasi Tailwind CSS dan instal shadcn/ui.
2. Setup project Supabase: buat schema tabel (Bagian 6), aktifkan RLS, tulis policy dasar per role.
3. Implementasi Auth (register/login/logout) dengan `@supabase/ssr`, middleware role-based routing.
4. Setup struktur folder sesuai Bagian 5, konfigurasi `database.types.ts` via `supabase gen types typescript`.

**Minggu 2 — Core Flow: Submission & Weighing**
5. Bangun form pengajuan setoran (kategori, berat estimasi, metode) + validasi Zod + generate kode/QR.
6. Bangun modul matching sederhana (assign manual oleh admin/self-assign oleh pengepul dari daftar pending).
7. Bangun form input berat oleh petugas + logic perhitungan nominal (`lib/utils/pricing.ts`) + unit test.
8. Bangun alur konfirmasi dua arah dan update wallet secara atomic saat status `completed`.

**Minggu 3 — Dashboard, Wallet, & Admin Panel**
9. Bangun dashboard coffee shop: Riwayat Sampah (list + filter) dan Total Pendapatan (card ringkasan + breakdown kategori).
10. Bangun fitur saldo & request withdrawal.
11. Bangun panel admin: kelola kategori/tarif, kelola status mitra pengepul, monitoring transaksi.
12. Implementasi gamifikasi ringan (badge & progress bulanan) dengan scheduled job sederhana.

**Minggu 4 — Testing, Polish, & Deployment**
13. Tulis test: unit (pricing, validators), integration (Server Actions), E2E (Playwright) untuk alur kritikal.
14. Verifikasi RLS policy dengan skenario cross-user access.
15. Polish UI/UX (responsive check, empty states, loading states, error toasts) sesuai desain Figma tim.
16. Deploy ke Vercel, hubungkan ke Supabase production, uji end-to-end di environment production.
17. Siapkan data dummy/demo (beberapa coffee shop, pengepul, transaksi selesai) untuk kebutuhan pitching & Q&A juri.
