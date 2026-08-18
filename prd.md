# PRD — PilahCash

**Tagline:** "Membuat sampah bernilai, tanpa ribet — setor sampah, dapat uang, transparan."

**Versi Dokumen:** 1.0
**Tanggal:** 14 Agustus 2026
**Kompetisi:** 10th IndonesiaNEXT Hackathon by Telkomsel — Tahap Final
**Tech Stack Target:** Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui (di atas Radix UI), Supabase (Postgres + Auth + Storage), deploy ke Vercel

---

## 1. Problem Statement

Coffee shop skala kecil–menengah menghasilkan sampah kemasan operasional dalam volume tinggi setiap harinya — kaleng susu kental manis, botol syrup, kemasan kopi, dus kardus dari supplier, botol UHT, hingga cup reject. Sampah ini menumpuk karena:

- Pemilik/staf coffee shop **tidak tahu atau tidak sempat** mencari pengepul yang mau mengambil sampah secara rutin dan bisa dipercaya.
- Proses penyaluran sampah masih **manual** — telepon-teleponan, negosiasi harga, dan pencatatan sendiri tanpa sistem yang transparan.
- **Tidak ada data yang jelas** soal seberapa besar nilai ekonomi dari sampah yang menumpuk tersebut, sehingga potensinya hilang begitu saja.

Di sisi lain, **pengepul** juga kesulitan: mereka harus berkeliling atau menunggu pasokan sampah datang sendiri, tidak punya visibilitas soal coffee shop mana yang punya sampah rutin dan konsisten, serta bersaing dengan pengepul lain untuk sumber sampah yang sama.

**Pertanyaan inti:** Bagaimana coffee shop bisa menyalurkan sampah kemasan bernilai ekonomi ke pengepul secara mudah, transparan, dan terjadwal — tanpa harus mencari mitra sendiri — sementara pengepul mendapat akses ke sumber sampah yang konsisten?

## 2. Goals

**Goals produk (MVP untuk final IndonesiaNEXT):**

1. Memungkinkan coffee shop mengajukan setoran sampah kemasan (langsung atau dijemput) dalam < 2 menit tanpa perlu mencari pengepul sendiri.
2. Menyediakan proses **matching** yang menghubungkan pengajuan setoran coffee shop ke pengepul mitra terdekat/tersedia.
3. Memberikan **transparansi penuh**: berat, kategori sampah, dan nominal yang didapat harus terlihat jelas dan dapat diverifikasi kedua pihak sebelum transaksi final.
4. Menyediakan dashboard **Riwayat Sampah** dan **Total Pendapatan Sampah** sehingga coffee shop dapat melihat dampak lingkungan dan ekonomi dari kontribusinya.
5. Membangun MVP yang **tidak bergantung pada hardware mahal** (timbangan pintar/IoT) — cukup input manual oleh petugas pengepul, dengan roadmap otomatisasi di fase lanjutan.
6. Menunjukkan model bisnis yang jelas (komisi per transaksi dan/atau biaya langganan coffee shop) sebagai dasar keberlanjutan setelah hackathon.

**Non-goals (lihat juga bagian Scope):**
- Bukan tujuan MVP untuk membangun integrasi IoT/timbangan pintar.
- Bukan tujuan MVP untuk melayani rumah tangga individu — fokus B2B ke coffee shop.

## 3. Target User

| Segmen | Kebutuhan | Peran di Sistem |
|---|---|---|
| **Pemilik/Staf Coffee Shop** (skala kecil–menengah) | Cara praktis & cepat menyalurkan sampah kemasan operasional, transparansi nominal yang didapat, tanpa perlu cari pengepul sendiri | Role: `coffee_shop` — mengajukan setoran/penjemputan |
| **Petugas Pengepul / Mitra Daur Ulang** | Akses ke sumber sampah rutin & konsisten, alur kerja pencatatan yang jelas, mengurangi waktu mencari sumber sampah | Role: `pengepul` — menerima/scan setoran, input berat, konfirmasi transaksi |
| **Admin PilahCash** | Mengelola mitra pengepul, kategori sampah & tarif, memantau transaksi dan menyelesaikan sengketa | Role: `admin` — pengelolaan platform |

Berdasarkan rumus customer segment: *Membantu **coffee shop skala kecil–menengah** untuk mengatasi **kesulitan menyalurkan sampah kemasan operasional ke pengepul secara rutin dan transparan**, sehingga dapat **mengubah sampah menjadi nilai ekonomi tambahan sambil menjaga operasional tetap bersih dan ramah lingkungan**.*

## 4. User Story

**Sebagai Coffee Shop:**
- Sebagai pemilik coffee shop, saya ingin mendaftar dan login agar profil bisnis saya tersimpan di platform.
- Sebagai pemilik coffee shop, saya ingin memilih kategori sampah (plastik, kertas, logam, organik, kaca, residu) agar petugas tahu apa yang akan disetor.
- Sebagai pemilik coffee shop, saya ingin memilih metode setor (**Setor Langsung** ke drop point atau **Dijemput**) agar sesuai dengan kondisi operasional saya.
- Sebagai pemilik coffee shop, saya ingin melihat kode/QR transaksi agar proses verifikasi dengan petugas berjalan cepat dan jelas.
- Sebagai pemilik coffee shop, saya ingin mengonfirmasi berat & nominal sebelum transaksi final agar saya yakin tidak ada kesalahan input.
- Sebagai pemilik coffee shop, saya ingin melihat riwayat setoran dan total pendapatan sampah agar saya bisa memantau dampak ekonomi & lingkungan dari usaha saya.
- Sebagai pemilik coffee shop, saya ingin menarik saldo yang terkumpul ke rekening/e-wallet saya.
- Sebagai pemilik coffee shop, saya ingin mendapat badge/progress bulanan (gamifikasi ringan) agar termotivasi menyetor secara rutin.

**Sebagai Petugas Pengepul:**
- Sebagai petugas pengepul, saya ingin mencari/scan kode transaksi dari coffee shop agar saya tahu setoran mana yang sedang diproses.
- Sebagai petugas pengepul, saya ingin menginput berat sampah secara manual agar sistem otomatis menghitung nominal yang harus dibayarkan.
- Sebagai petugas pengepul, saya ingin sistem menghitung nominal secara otomatis berdasarkan kategori & berat agar saya tidak perlu menghitung manual dan menghindari human error.
- Sebagai petugas pengepul, saya ingin melihat daftar penjemputan yang harus saya jalankan hari ini agar rute kerja saya lebih efisien.

**Sebagai Admin:**
- Sebagai admin, saya ingin mengelola daftar kategori sampah & tarif per kategori agar harga selalu update mengikuti harga pasar bahan daur ulang.
- Sebagai admin, saya ingin memantau seluruh transaksi di platform agar saya dapat mendeteksi anomali/sengketa.
- Sebagai admin, saya ingin mengelola mitra pengepul (approve/nonaktifkan) agar kualitas layanan terjaga.

## 5. Functional Requirements

| ID | Requirement | Prioritas |
|---|---|---|
| FR-1 | Sistem harus menyediakan autentikasi (register/login/logout) dengan role: `coffee_shop`, `pengepul`, `admin` | Must |
| FR-2 | Coffee shop dapat mengajukan setoran sampah dengan memilih kategori, estimasi berat, dan metode setor (Setor Langsung / Dijemput) | Must |
| FR-3 | Sistem menghasilkan kode/QR transaksi unik untuk setiap pengajuan setoran | Must |
| FR-4 | Sistem melakukan matching pengajuan penjemputan ke pengepul mitra yang tersedia/terdekat | Must |
| FR-5 | Petugas pengepul dapat mencari/scan kode transaksi dan menginput berat aktual secara manual | Must |
| FR-6 | Sistem menghitung nominal transaksi otomatis: `nominal = berat × tarif kategori`, dengan potongan 15–20% untuk metode Dijemput | Must |
| FR-7 | Metode Dijemput memiliki minimal berat 2kg; Setor Langsung tanpa minimal berat | Must |
| FR-8 | Transaksi memerlukan konfirmasi dua arah (petugas input → coffee shop konfirmasi) sebelum dianggap final dan saldo bertambah | Must |
| FR-9 | Coffee shop dapat melihat Riwayat Sampah (jenis, berat, tanggal, status) dalam bentuk list terurut | Must |
| FR-10 | Coffee shop dapat melihat dashboard Total Pendapatan Sampah (akumulasi saldo, grafik/tren bulanan) | Must |
| FR-11 | Coffee shop dapat menarik saldo (request withdrawal) ke rekening bank/e-wallet | Should |
| FR-12 | Sistem menyediakan gamifikasi ringan: progress bulanan & badge (mis. "Pahlawan Hijau") | Should |
| FR-13 | Admin dapat mengelola kategori sampah & tarif per kategori (CRUD) | Must |
| FR-14 | Admin dapat mengelola akun/status mitra pengepul (approve, suspend) | Should |
| FR-15 | Admin dapat melihat seluruh transaksi platform beserta status & bisa menandai transaksi bermasalah/sengketa | Should |
| FR-16 | Sistem mencatat log setiap perubahan status transaksi untuk keperluan audit trail transparansi | Could |

## 6. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Performance** | Halaman utama (dashboard) harus load < 2.5 detik pada koneksi 4G standar; query Supabase dioptimalkan dengan index pada kolom yang sering difilter (user_id, status, created_at) |
| **Security** | Autentikasi via Supabase Auth; Row Level Security (RLS) aktif di seluruh tabel agar coffee shop hanya bisa mengakses data miliknya sendiri, dan pengepul hanya mengakses transaksi yang ditugaskan padanya |
| **Reliability** | Perhitungan nominal transaksi harus konsisten (idempotent) — tidak boleh terhitung ganda jika terjadi retry/refresh |
| **Usability** | UI harus dapat digunakan oleh pengguna non-teknis (ibu warung/staf coffee shop) tanpa training — alur maksimal 3–4 langkah untuk mengajukan setoran |
| **Scalability** | Skema database dirancang agar mudah menambah kategori sampah baru dan mitra pengepul baru tanpa migrasi besar |
| **Availability** | Target uptime 99% selama masa demo/pitching (deploy di Vercel dengan Supabase managed database) |
| **Maintainability** | Kode ditulis TypeScript strict mode, terstruktur modular (feature-based folder) agar mudah dikembangkan tim lanjutan pasca-hackathon |
| **Accessibility** | Kontras warna dan ukuran tap-target mengikuti standar WCAG AA dasar, mengingat sebagian pengguna (petugas lapangan) mengakses via mobile browser |
| **Auditability** | Setiap transaksi harus punya jejak (siapa input berat, siapa konfirmasi, timestamp) untuk transparansi yang dijanjikan ke user |

## 7. Scope

### In Scope (MVP — untuk final IndonesiaNEXT)
- Autentikasi 3 role (coffee shop, pengepul, admin)
- Pengajuan setoran (Setor Langsung & Dijemput) dengan kategori sampah
- Kode/QR transaksi & alur konfirmasi dua arah
- Input berat manual oleh petugas + perhitungan nominal otomatis
- Riwayat Sampah & Dashboard Total Pendapatan
- Saldo & pengajuan penarikan dana (withdrawal request, tanpa integrasi payment gateway penuh — bisa disimulasikan/manual approval di MVP)
- Gamifikasi ringan (badge & progress bulanan)
- Panel admin dasar: kelola kategori/tarif, kelola mitra pengepul, monitoring transaksi

### Out of Scope (Fase Lanjutan / Roadmap)
- Integrasi timbangan digital/IoT untuk otomatisasi penuh
- Integrasi payment gateway/disbursement otomatis (mis. Xendit, Midtrans) — di MVP cukup pencatatan saldo & request penarikan
- Aplikasi mobile native (MVP berbasis web responsive)
- Optimasi rute penjemputan otomatis (routing algorithm) untuk armada
- Marketplace multi-pengepul dengan sistem lelang harga
- Fitur konsultasi/chat langsung antara coffee shop dan pengepul
- Ekspansi ke segmen rumah tangga individu (fokus MVP: B2B coffee shop)
