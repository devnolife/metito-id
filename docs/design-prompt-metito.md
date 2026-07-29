# Prompt Pembuatan Website PT. METITO

Dokumen ini adalah **prompt siap pakai** untuk membangun (atau membangun ulang)
tampilan publik website PT. METITO. Seluruh isinya diturunkan langsung dari
company profile resmi `informasi.pdf` — palet warna, tipografi, struktur UI, dan
copy diambil dari 12 halaman deck tersebut.

Cara pakai: salin blok **"Prompt"** di bawah ke agent/LLM pembuat UI. Bagian
setelahnya adalah lampiran referensi (palet, konten per section, aturan motion)
yang bisa ikut disalin bila dibutuhkan detail penuh.

---

## Prompt

> Bangun website company profile untuk **PT. METITO (Multi Enviro Tirta
> Teknologi)**, penyedia solusi terintegrasi untuk *Water Treatment, Industrial
> Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services* di
> Indonesia. Tagline: *"Integrated Solutions for Water, Industry and Mining"*.
> Slogan penutup: *"Clean Water, Clean Future."*
>
> **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v3 +
> shadcn/ui (Radix) + framer-motion + lucide-react. Server Component secara
> default; `"use client"` hanya bila butuh state/motion.
>
> **Arah estetik — "instrumen industri kelas atas, bukan slide deck".**
> Ground midnight navy, aksen champagne gold tunggal, heading putih. Nuansanya
> teknis dan presisi: sudut nyaris siku (radius 4px), hairline 1px, label mono
> huruf kapital ber-tracking lebar sebagai "rail" teknis, angka indeks section
> (`01`–`06`), dan kepadatan informasi yang terkendali. Bukan startup SaaS,
> bukan gradient ungu, bukan kartu rounded-2xl yang mengambang.
>
> **Palet (wajib persis — diambil dari company profile):**
> | Peran | Hex |
> | --- | --- |
> | Ground halaman | `#0A1628` |
> | Navy terdalam | `#060E1B` |
> | Permukaan kartu | `#0F1F3A` |
> | Permukaan naik (hover) | `#16304F` |
> | Hairline / border | `#1A3A5C` |
> | **Aksen utama (gold)** | `#E1C478` |
> | Gold terang (hover) | `#F0DBA4` |
> | Gold redup (pressed) | `#C0A254` |
> | Biru air (sekunder, langka) | `#0081DA` |
> | Teks body | `#C8D6E5` |
> | Teks muted | `#6B7B8D` |
> | Heading | `#FFFFFF` |
>
> **Disiplin warna:** gold memikul *seluruh* tugas aksen UI — tombol primer,
> rail, garis penutup section, state aktif nav, highlight headline, bullet
> katalog. Biru air **hanya** muncul pada elemen yang secara harfiah mewakili
> air (garis skematik aliran di hero). Jangan sebar biru ke komponen UI. Rasio
> kasar: 70% navy, 20% putih/teks, 10% gold.
>
> **Tipografi:** display grotesque industrial yang tegas untuk headline
> (`font-black`, `leading-[0.92]`, `tracking-[-0.04em]`, ukuran
> `clamp(2.5rem,5.4vw,4.5rem)`); sans humanis yang bersih untuk body; monospace
> untuk rail teknis (`0.6875rem`, `tracking-[0.2em]`, uppercase). Hindari Inter,
> Roboto, Arial, dan system font.
>
> **Sistem layout:**
> - Container `max-w-7xl`, padding `px-6 lg:px-8`, grid 12 kolom.
> - Hero: split asimetris — tipografi menguasai kiri (8 kolom), foto instalasi
>   water treatment di kanan (58% lebar) dengan grading navy agresif agar teks
>   putih tetap dominan. Rail kapabilitas (WTP / WWTP / STP / RO) sebagai panel
>   instrumen di kanan.
> - Section dibuka dengan penanda: indeks mono gold + garis hairline 8px +
>   judul. Ditutup dengan garis gradient gold yang memudar di kedua ujung.
> - Katalog produk memakai **baris terindeks** (border-top hairline, nomor mono,
>   garis gold menyapu dari kiri saat hover) — bukan grid kartu.
> - Latar diberi atmosfer: blueprint grid gold 5% opacity, grain noise 3.5%,
>   dan radial glow gold untuk menambatkan section. Jangan pakai warna solid rata.
>
> **Motion:** satu page-load yang terorkestrasi dengan reveal bertahap
> (`animation-delay` berjenjang) lebih berkesan daripada micro-interaction yang
> berserakan. Easing `cubic-bezier(0.22, 1, 0.36, 1)`, durasi 300–550ms. Panel
> punya sheen radial yang mengikuti kursor via `--mx/--my`. Garis aliran di hero
> beranimasi `stroke-dashoffset` 16–28s linear infinite. Hormati
> `prefers-reduced-motion`.
>
> **Konten:** seluruh copy berbahasa Indonesia, istilah teknis tetap Inggris
> (Reverse Osmosis, Demineralization Plant, dst). Ambil dari `lib/company-profile.ts`
> sebagai satu-satunya sumber kebenaran. Struktur halaman: Hero → About Us →
> Vision & Mission → Business Lines → Our Products → Our Clients → Contact.
>
> **Aksesibilitas:** kontras teks body `#C8D6E5` di atas `#0A1628` ≈ 11:1.
> Gold `#E1C478` hanya untuk teks besar/tebal atau elemen non-teks. Setiap
> kontrol interaktif punya focus ring gold yang terlihat.

---

## Lampiran A — Token yang sudah terpasang

Palet di atas sudah hidup di repo ini sebagai CSS custom property di
`app/globals.css` dan terdaftar sebagai named color Tailwind di
`tailwind.config.ts`.

```css
--navy: #0a1628;        --gold: #e1c478;        --body-text: #c8d6e5;
--navy-deep: #060e1b;   --gold-bright: #f0dba4; --body-muted: #6b7b8d;
--surface: #0f1f3a;     --gold-dim: #c0a254;
--surface-2: #16304f;   --aqua: #0081da;
--hairline: #1a3a5c;
```

Setiap token punya pasangan `*-rgb` (mis. `--gold-rgb: 225 196 120`) supaya
modifier opacity Tailwind bekerja: pakai `bg-gold/45`, **bukan**
`bg-[var(--gold)]/45` — bentuk kedua dihitung Tailwind menjadi transparan penuh.

`--lime*` adalah alias legacy dari nama aksen lama dan kini menunjuk ke gold,
sehingga ±90 call site di halaman publik otomatis memakai aksen deck.

Utility yang tersedia: `.rail`, `.blueprint`, `.blueprint-fine`, `.grain`,
`.glow-gold`, `.glow-aqua`, `.panel`, `.ticked`, `.index-row`, `.profile-heading`,
`.profile-rule`, `.profile-card`, `.profile-bullet`, `.marquee-track`, `.flow-line`.

## Lampiran B — Konten per section (dari deck)

**About Us.** PT. METITO adalah perusahaan penyedia solusi terintegrasi untuk
sektor Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts,
dan Mining Support Services. Tiga pilar: *Kualitas Produk Terjamin* (produk
berkualitas tinggi dari supplier terpercaya), *Pengiriman Tepat Waktu*
(komitmen terhadap ketepatan waktu), *Kepuasan Pelanggan* (layanan purna jual
dan dukungan teknis profesional).

**Vision & Mission.** Visi: menjadi mitra terpercaya dalam penyediaan solusi
terintegrasi untuk kebutuhan air, industri, dan pertambangan di Indonesia.
Misi (4 butir): produk berkualitas dengan harga kompetitif; solusi engineering
efektif dan efisien; hubungan jangka panjang berbasis kepercayaan; mendukung
keberlanjutan operasional pelanggan. Core values: Quality, Excellent Service,
Integrity, Innovation.

**Business Lines (4).** Chemical Supply · Engineering Services · Equipment
Supply · Spare Parts Supply.

**Our Products (6 kategori).**
- *Chemical Supply* — bahan kimia industri untuk berbagai aplikasi.
- *Water Treatment* — Ion Exchange Resin, Filter Media, Membrane RO/UF/NF,
  Activated Carbon.
- *Equipment Supply* — HP Pump, Feed Pump, Dosing Pump, Blower, Multi Media
  Filter, Carbon Filter, Softener, RO System, Demin Plant, Chlorine Dioxide
  Generator, Instrumentation.
- *Consumables & Spare Parts* — Cartridge Filter, Valve, Mechanical Seal,
  Gasket, Bearing.
- *Carbon Graphite* — Carbon Brush, Carbon Vane, Carbon Seal, Carbon Connector.
- *Mining & Material Handling* — Conveyor Belt, Roller, Crusher Parts,
  Vibrating Screen.

**Katalog kimia (5 sub-kategori).** WTP (PAC, Aluminium Sulfate/Tawas, Soda Ash,
Caustic Soda, HCl, H₂SO₄, NaOCl, Activated Carbon, Silica Sand, Anthracite,
Resin Kation & Anion, Antiscalant RO, Membrane Cleaner) · WWTP (Polymer Anionik
& Kationik, PAC, Ferric Chloride, Ferrous Sulfate, Nutrient Bacteria, Defoamer,
pH Adjuster, Coagulant, Flocculant) · STP (Bio Culture, Enzyme Bacteria,
Chlorine, Chlorine Dioxide, Odor Control, Disinfectant) · Boiler & Cooling Tower
(Oxygen Scavenger, Scale Inhibitor, Boiler Treatment, Condensate Line Treatment,
Cooling Water Treatment) · Industrial Maintenance (Chain Lubricant, Food Grade
Lubricant, Penetrating Oil, Rust Remover, Contact Cleaner, Electrical Cleaner,
Degreaser, Industrial Cleaner).

**Engineering Services.** Design WTP/WWTP/STP, Reverse Osmosis System,
Demineralization Plant, Chlorine Dioxide System, Chemical Dosing System,
Installation & Commissioning, Preventive Maintenance, Plant Audit,
Troubleshooting System.

**Our Clients (6 industri).** Mining (batubara, nikel, emas, mineral) ·
Petrochemical · Oil & Gas · Palm Oil Refinery · Water Treatment · Power Plants.

**Contact.** Bontobila, Barombong, Kab. Gowa, Sulawesi Selatan ·
0812-1760-3950 / 0821-5555-1235 · www.metito.id · info@metito.id.

## Lampiran C — Yang harus dihindari

- Gradient ungu-ke-putih, glassmorphism generik, kartu `rounded-2xl` mengambang.
- Font sistem (Inter/Roboto/Arial) atau pilihan yang sudah jenuh.
- Menyebar biru air ke komponen UI — biru hanya untuk representasi air harfiah.
- `bg-[var(--token)]/50` — modifier opacity tidak bekerja pada `var()` di
  Tailwind v3; pakai named color (`bg-gold/50`).
- Grid kartu seragam untuk katalog produk; deck memakai daftar padat terindeks.
- Hardcode data perusahaan di komponen — semuanya dibaca dari
  `lib/company-profile.ts`.
