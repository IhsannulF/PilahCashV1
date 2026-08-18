# DESIGN.md — PilahCash

> Format: mengikuti struktur 9-bagian standar DESIGN.md (Stitch format, diperluas oleh koleksi VoltAgent/awesome-design-md) — dibuat khusus untuk PilahCash, bukan diekstrak dari brand lain.

---

## 1. Visual Theme

**Nama tema:** *Kraft & Canopy* — hijau hutan gelap sebagai kanvas kepercayaan, dipadukan lime cerah sebagai sinyal nilai/uang, di atas dasar krem seperti kertas kraft/kemasan daur ulang.

PilahCash adalah platform yang menghubungkan coffee shop dengan pengepul sampah kemasan. Temanya harus terasa **environmental tapi transaksional** — bukan eco-app pastel yang lembek, dan bukan fintech korporat yang dingin. Referensi mood: struk/tiket kertas kraft, kanopi pohon di malam hari, lampu neon lime di tengah gelap.

- **Canvas type:** Light-first (dashboard operasional harian) dengan dark "statement" section untuk hero/marketing dan kartu ringkasan saldo.
- **Kepribadian:** membumi, jujur/transparan, sedikit "gritty" (kertas, cap, garis putus-putus struk) — bukan glossy/gradient.
- **Silhouette produk:** kartu bersudut membulat meniru struk fisik, dengan garis dashed pemisah seperti sobekan tiket.

## 2. Color Palette

| Semantic Name | Hex | Functional Role |
|---|---|---|
| Forest Canopy (Primary Dark) | `#16301F` | Background hero/marketing, navbar, kartu ringkasan saldo, footer |
| Forest Deep (Primary Dark Elevated) | `#20402E` | Card/panel di atas Forest Canopy, hover state tombol dark |
| Lime Signal (Primary Accent) | `#C7F13B` | CTA utama, nominal Rupiah, progress bar, indikator status "completed" |
| Lime Whisper (Accent Tint) | `#EAFAC4` | Background section terang alternatif, tag/badge lembut |
| Kraft Base (Canvas Light) | `#F6F2E7` | Background utama seluruh dashboard operasional (coffee shop & pengepul) |
| Kraft Card | `#FFFDF7` | Permukaan card di atas Kraft Base |
| Ink (Text Primary) | `#12210C` | Teks utama di atas background terang |
| Clay Signal (Secondary Accent) | `#E0733A` | Penanda metode "Dijemput", status menunggu/perhatian |
| Ember (Destructive) | `#C4402A` | Error, dispute, aksi batalkan |
| Paper Line (Border/Divider) | `#EDE7D8` | Border tipis, divider, state disabled |

**Prinsip pemakaian warna:**
- Lime **tidak pernah** dipakai sebagai warna teks body panjang — hanya aksen, angka besar, dan elemen non-teks di atas Forest Canopy (kontras ±12:1).
- Clay vs Lime adalah kode warna fungsional: Clay = metode Dijemput (ada potongan biaya), Lime = metode Setor Langsung (harga penuh) — dipertahankan konsisten di seluruh produk, bukan dekorasi bebas.
- Kraft Base menggantikan putih murni di seluruh permukaan default, menjaga nuansa "kemasan daur ulang" tanpa terasa kusam.

## 3. Typography

| Level | Typeface | Weight | Size (desktop) | Line Height | Penggunaan |
|---|---|---|---|---|---|
| Display XL | Space Grotesk | 700 | 48px / 3rem | 1.05 | Headline hero landing |
| Display L | Space Grotesk | 700 | 36px / 2.25rem | 1.1 | Judul dashboard, nominal saldo total |
| H1 | Space Grotesk | 600 | 28px / 1.75rem | 1.2 | Judul halaman |
| H2 | Space Grotesk | 600 | 24px / 1.5rem | 1.25 | Judul section/card |
| Body | Inter | 400 | 16px / 1rem | 1.5 | Paragraf, deskripsi, tabel |
| Body Medium | Inter | 500 | 16px / 1rem | 1.5 | Label form, nav item aktif |
| Caption | Inter | 500 | 14px / 0.875rem | 1.4 | Meta info, timestamp, helper text |
| Data Mono | JetBrains Mono | 500 | 15px / 0.9375rem | 1.4, tracking +0.02em | Kode transaksi, berat (kg), ID |

**Pairing rationale:** Space Grotesk (display) memberi karakter geometris-tebal yang pas untuk angka nominal besar tanpa terasa "korporat"; Inter (body) menjaga keterbacaan tinggi di tabel/form transaksional; JetBrains Mono memisahkan data terukur (fakta) dari teks naratif (pencapaian) secara visual.

## 4. Component Stylings

**Buttons**
- *Primary:* bg `#C7F13B`, text `#12210C`, radius `999px` (pill), font Inter 600. Hover: bg `#B5DE2E`. Active: scale `0.98`. Focus: ring `2px solid #C7F13B` offset `2px`.
- *Secondary (on dark):* transparent bg, border `1px solid #C7F13B`, text `#C7F13B`. Hover: bg `rgba(199,241,59,0.1)`.
- *Ghost:* text `#16301F`, no border/bg, underline on hover. Dipakai untuk aksi sekunder.
- *Destructive:* border `1px solid #C4402A`, text `#C4402A`, transparent bg — sengaja tidak solid agar tidak dominan.
- *Disabled:* bg `#EDE7D8`, text `#9B9585`, no hover/active state, cursor not-allowed.

**Cards**
- *Default (light):* bg `#FFFDF7`, border `1px solid #EDE7D8`, radius `16px`, shadow `0 1px 3px rgba(18,33,12,0.06)`.
- *Featured/Dark (ringkasan saldo, hero):* bg `#16301F`, text `#F6F2E7`, radius `16px`, angka penting dalam Lime Signal, no border.
- *Transaction card (signature element):* radius `16px`, garis dashed `1px #EDE7D8` horizontal membagi "info coffee shop" dan "info transaksi", kode transaksi dalam Data Mono, nominal dalam Display L + Lime Signal di atas bg gelap.

**Status Badge**
- `pending`: bg `#EDE7D8`, text `#12210C`, dot netral.
- `matched` / `weighed`: bg `rgba(224,115,58,0.15)`, text `#E0733A`, dot Clay.
- `completed`: bg `rgba(199,241,59,0.2)`, text `#16301F`, dot Lime solid.
- `disputed`: bg `rgba(196,64,42,0.12)`, text `#C4402A`, dot Ember.
- Semua badge menyertakan dot/ikon, tidak mengandalkan warna saja (aksesibilitas).

**Forms**
- Input: bg `#F6F2E7`, border `1px solid #EDE7D8`, radius `10px`, padding `12px 16px`. Focus: ring `2px solid #C7F13B`, border berubah ke `#16301F`.
- Label: Inter 500, `#12210C`, caption size, uppercase tracking-wide kecil.
- Error state: border `#C4402A`, helper text `#C4402A` di bawah field, ikon peringatan Clay/Ember.

**Navigation**
- Navbar di atas Forest Canopy: logo kiri, menu tengah (Inter 500, `#F6F2E7`), CTA pill Lime kanan.
- Sidebar dashboard di atas Kraft Base: item aktif bg `#EAFAC4`, text `#16301F` bold; item non-aktif text `#5A6B54`.

## 5. Layout Principles

- Grid 12 kolom, max-width konten `1200px`, gutter `24px`.
- Padding vertikal antar section: `96px` desktop / `56px` mobile — ritme lega, tidak padat.
- Alur informasi dashboard: **ringkasan (dark card) → aksi cepat (pill buttons) → detail/breakdown (light cards)** — urutan ini konsisten di semua halaman utama agar pengguna non-teknis (staf coffee shop) tidak perlu belajar ulang tiap halaman.
- Form pengajuan setoran dibatasi maksimal 4 langkah/field terlihat sekaligus, sesuai prinsip "tanpa ribet" dari brief produk.
- Konten transaksional (tabel riwayat, daftar job pengepul) menggunakan layout list vertikal dengan row height konsisten `64px`, bukan grid kartu — memudahkan scanning cepat oleh petugas lapangan di mobile.

## 6. Depth & Elevation

| Level | Shadow / Treatment | Penggunaan |
|---|---|---|
| Level 0 | tanpa shadow, hanya border `#EDE7D8` | Card default di atas Kraft Base |
| Level 1 | `0 1px 3px rgba(18,33,12,0.06)` | Card interaktif (hover-able), input focus |
| Level 2 | `0 4px 12px rgba(18,33,12,0.10)` | Dropdown, popover, toast notification |
| Level 3 | `0 12px 32px rgba(18,33,12,0.16)` | Modal, dialog konfirmasi transaksi |
| Dark elevation | tanpa shadow — dibedakan lewat warna (`#16301F` → `#20402E`), bukan bayangan | Card gelap di atas card gelap (mis. breakdown di dalam hero) |

Elevasi tidak memakai glassmorphism/blur — konsisten dengan tema "kertas kraft" yang solid dan flat, bukan translucent.

## 7. Do's and Don'ts

**Do:**
- Gunakan Lime Signal hanya untuk elemen yang merepresentasikan **nilai/aksi positif** (CTA, nominal, status selesai).
- Pertahankan pembedaan warna Clay (Dijemput) vs Lime (Setor Langsung) di setiap titik produk yang menampilkan metode setor.
- Gunakan Data Mono untuk semua angka terukur (kg, kode transaksi, ID) agar konsisten dibedakan dari angka pencapaian (Rupiah, dalam Display).
- Jaga radius `16px` pada card dan `999px` pada tombol di seluruh produk — konsistensi bentuk adalah bagian dari identitas.

**Don't:**
- Jangan pakai Lime Signal sebagai warna teks body/paragraf di atas Kraft Base — kontras terlalu rendah untuk teks panjang.
- Jangan tambahkan gradient atau efek glossy — tema ini flat & matte, meniru kertas, bukan plastik/kaca.
- Jangan pakai ikon filled-solid; sistem ikon PilahCash konsisten line/rounded-stroke.
- Jangan gunakan warna merah generik untuk error — gunakan Ember (`#C4402A`) yang senada suhu dengan Clay agar tetap dalam satu keluarga warna.
- Jangan menambah warna aksen baru di luar 10 token di atas tanpa alasan fungsional yang jelas.

## 8. Responsive Behavior

- **Breakpoints:** mobile `<640px`, tablet `640–1024px`, desktop `>1024px`.
- **Mobile-first untuk flow petugas pengepul** — dashboard pengepul (input berat, cari kode) dioptimalkan untuk single-column mobile terlebih dahulu karena digunakan di lapangan.
- **Touch target minimum:** `44×44px` untuk semua tombol dan item list interaktif.
- **Navbar:** collapse ke hamburger menu di bawah `1024px`; CTA pill utama tetap terlihat di header mobile (tidak disembunyikan di menu).
- **Card grid** (breakdown kategori, fitur landing): 3 kolom desktop → 2 kolom tablet → 1 kolom mobile, gap tetap `16px`.
- **Tabel riwayat transaksi:** di desktop tampil sebagai tabel penuh; di mobile bertransformasi jadi stacked list card (setiap baris jadi card ringkas dengan label inline), bukan scroll horizontal.
- **Kartu transaksi (signature element):** proporsi tetap terjaga (aspect-ratio ~1.6:1) di semua breakpoint agar tetap terasa seperti "struk fisik".

## 9. Agent Prompt Guide

**Cheat-sheet warna cepat:**
```
Primary dark bg   → #16301F (Forest Canopy)
Primary accent    → #C7F13B (Lime Signal) — CTA & nominal saja
Base canvas       → #F6F2E7 (Kraft Base)
Text on light     → #12210C (Ink)
Text on dark      → #F6F2E7 (Kraft Base)
Secondary accent  → #E0733A (Clay) — metode Dijemput / warning
Destructive       → #C4402A (Ember)
Border/divider    → #EDE7D8 (Paper Line)
```

**Prompt siap pakai untuk coding agent:**

- *"Buat hero landing PilahCash: bg Forest Canopy (#16301F), headline Display XL Space Grotesk 700 warna Kraft Base, CTA pill Lime Signal, tampilkan mock kartu transaksi (signature element) dengan garis dashed dan nominal besar Lime di pojok."*
- *"Buat dashboard card ringkasan Total Pendapatan Sampah: bg Forest Canopy, radius 16px, angka nominal Display L Space Grotesk warna Lime Signal, subtext Inter 400 warna Kraft Base 70% opacity."*
- *"Buat komponen status badge untuk transaksi dengan state pending/matched/weighed/completed/disputed sesuai token warna di Section 2, sertakan dot indicator, radius pill penuh, font Inter 500 caption size."*
- *"Buat form pengajuan setoran sampah: input bg Kraft Base, border Paper Line, radius 10px, focus ring Lime Signal 2px, label Inter 500 uppercase caption, maksimal 4 field terlihat per langkah."*
- *"Buat tabel riwayat transaksi yang di mobile bertransformasi jadi stacked card list, setiap baris tampilkan kode transaksi dalam JetBrains Mono, berat dalam kg, dan status badge di kanan."*

**Guardrail untuk agent:** selalu rujuk ke 10 token warna di Section 2 by semantic name (bukan hex mentah dalam percakapan), pertahankan radius `16px`/`999px`, dan jangan perkenalkan gradient/shadow berlebih — sistem ini sengaja flat dan matte.