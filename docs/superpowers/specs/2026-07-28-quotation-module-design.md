# Desain: Modul Penawaran (Quotation) PT. Metito

Tanggal: 2026-07-28
Status: disetujui per bagian, siap masuk tahap perencanaan implementasi

## Masalah

PT. Metito membuat surat penawaran dengan dua berkas Excel terpisah:

- `Log_Penomoran_Surat_Penawaran_METITO.xlsx` — log penomoran
- `Quotation 2026.xlsx` — dokumen penawaran (satu sheet per penawaran, dibuat dengan menyalin sheet sebelumnya)

Pemeriksaan berkas menemukan cacat nyata yang berdampak langsung ke dokumen yang mengikat pelanggan:

| # | Temuan | Bukti |
| --- | --- | --- |
| 1 | Terbilang tidak ikut terupdate saat menyalin sheet | Sheet *Chemical Safetindo* bertotal Rp 179.265.000 tetapi terbilang "Dua Ratus Enam Puluh Juta Delapan Ratus Lima Puluh Ribu Rupiah" (nilai dari sheet lain) |
| 2 | Perihal tertinggal dari sheet sumber | Sheet kimia berperihal "Pengadaan Cable Instrument" |
| 3 | Nomor surat dobel | `001/QUO-METITO/VII/2026` dipakai dua sheet |
| 4 | Tiga konvensi penomoran berbeda | `QUO-METITO`, `SPH-METITO`, dan contoh `METITO-SPH` di sheet Pengaturan |
| 5 | Penomoran bergantung posisi baris | Rumus `Pengaturan!$B$5+ROW()-3` — menghapus/menyortir baris mengubah nomor surat yang sudah terkirim |
| 6 | Nomor urut item salah | Kolom No berisi `2, 2, 3` pada dua sheet |
| 7 | S&K bertentangan dengan perhitungan | Tertulis "Price include PPN 11%" padahal PPN ditambahkan di atas Jumlah |
| 8 | Log terputus dari dokumen | Log hanya berisi 1 baris contoh, sementara ada 3 penawaran nyata |

Tujuan: mengganti kedua berkas dengan modul di dalam panel admin yang sudah ada, sehingga cacat di atas menjadi **tidak mungkin terjadi secara struktural**, bukan sekadar diperbaiki manual.

## Keputusan yang sudah disepakati

| Topik | Keputusan |
| --- | --- |
| Lokasi | Di dalam panel admin METITO yang sudah ada, memakai ulang autentikasi |
| Sumber item & harga | Tanpa master. Ketik bebas; sistem belajar dari riwayat penawaran (autocomplete brand/type/harga terakhir) |
| Waktu penomoran | Saat "Terbitkan". Draft tidak bernomor |
| Titik masuk | Sales input manual (permintaan via email/WA/telepon) |
| Persetujuan | Tidak ada. Sales menerbitkan sendiri |
| Pengiriman | Halaman publik ber-token + tombol kirim WhatsApp berisi tautan |
| Revisi | Nomor sama + penanda revisi (`Rev.1`); versi lama tersimpan |
| Jenis dokumen | Hanya `SPH`. `QUO` dihapus |
| Format nomor | `{NNN}/SPH-Metito/{BULAN_ROMAWI}/{TAHUN}` — contoh `001/SPH-Metito/VII/2026` |
| Reset counter | Tiap tahun (Januari) |
| Status | `DRAFT` → `SENT` → `WON`/`LOST`, plus "Kedaluwarsa" terhitung dari masa berlaku |
| Render dokumen | Halaman cetak + link publik (tanpa dependency PDF baru) |
| Pengujian | Tambah Vitest |

### Aturan format nomor

`{NNN}/{KODE_DOK}-{KODE_PERUSAHAAN}/{BULAN_ROMAWI}/{TAHUN}`

- `NNN` — nomor urut, minimal 3 digit dengan nol di depan (`001`; melebar sendiri di atas `999`)
- `KODE_DOK` — `SPH`
- `KODE_PERUSAHAAN` — `Metito` (M besar, sisanya kecil)
- `BULAN_ROMAWI` — dari tanggal terbit
- `TAHUN` — 4 digit

Ketiga komponen kode disimpan di tabel `Setting` agar dapat diubah dari admin tanpa mengubah kode.

## Bagian 1 — Model data & mesin penomoran

Tiga tabel baru, terpisah dari `Product`/`Customer` yang berbentuk data marketing (`Product.price` bertipe String berisi "Hubungi Kami"; `Customer` sebenarnya model testimoni).

```prisma
enum QuotationStatus { DRAFT SENT WON LOST }

model Quotation {
  id             String  @id @default(cuid())
  seq            Int?      // dari counter tahunan; null selama draft
  numberBase     String?   // "001/SPH-Metito/VII/2026"
  revision       Int     @default(0)   // 0 = asli, 1 = Rev.1
  parentId       String?                // rantai revisi
  status         QuotationStatus @default(DRAFT)
  issuedAt       DateTime?
  validUntil     DateTime?

  // snapshot — dibekukan saat terbit
  customerName   String
  attn           String?
  subject        String
  franco         String?
  deliveryTime   String?
  termsOfPayment String?
  validityDays   Int     @default(30)
  vatRate        Decimal @db.Decimal(5,4)    // 0.11
  subtotal       Decimal @db.Decimal(18,2)
  vatAmount      Decimal @db.Decimal(18,2)
  total          Decimal @db.Decimal(18,2)
  amountInWords  String                       // terbilang, dibekukan

  publicToken    String? @unique
  firstViewedAt  DateTime?
  viewCount      Int     @default(0)

  createdById    String
  items          QuotationItem[]

  @@unique([numberBase, revision])
}

model QuotationItem {
  id           String  @id @default(cuid())
  quotationId  String
  lineNo       Int
  materialCode String            // "Kable 4 Core"
  brand        String?           // "LiCYC"
  type         String?           // "LiCYC 4x1.5 mmsq"
  qty          Decimal @db.Decimal(18,3)
  unit         String            // "m", "Pail"
  unitPrice    Decimal @db.Decimal(18,2)
  lineTotal    Decimal @db.Decimal(18,2)
}

model QuotationCounter {
  year    Int @id
  lastSeq Int
}
```

Empat keputusan yang menutup cacat Excel secara struktural:

1. **Counter atomik per tahun.** Nomor diambil di dalam transaksi yang menaikkan `lastSeq`. Tidak mungkin dobel dan tidak bergantung posisi baris. Menutup temuan 3 dan 5.
2. **Snapshot penuh.** Nama pelanggan, S&K, harga, dan terbilang disalin ke dokumen saat terbit. Perubahan data master tidak mengubah dokumen yang sudah terkirim.
3. **Terbilang dibangkitkan otomatis** dari `total` oleh satu fungsi murni. Menutup temuan 1.
4. **Uang memakai `Decimal`**, bukan float, agar PPN tidak menyimpang karena pembulatan.

Kedaluwarsa **dihitung saat pembacaan** (`validUntil` lewat dan status masih `SENT`), bukan lewat cron — tanpa infrastruktur penjadwal dan tidak pernah basi.

Autocomplete memakai `QuotationItem` sendiri sebagai riwayat; tidak ada tabel master.

### Aturan revisi

- Revisi mewarisi `numberBase` dan `seq` induknya, hanya `revision` yang naik. Counter tahunan **tidak** ikut naik.
- `validUntil` revisi dihitung ulang dari tanggal terbit revisi itu sendiri, bukan diwarisi dari induk.
- Induk tidak berubah status. Label "digantikan oleh Rev.N" **diturunkan** dari keberadaan anak, sehingga tidak perlu status baru.
- Hanya revisi terakhir yang dapat ditandai `WON`/`LOST`. Versi lama bersifat arsip.
- Token publik induk dimatikan saat revisi terbit, agar pelanggan tidak membuka versi usang.

## Bagian 2 — Layar & alur kerja

| Rute | Fungsi |
| --- | --- |
| `/admin/quotations` | Daftar penawaran, menggantikan Log Penomoran. Kolom: Nomor, Tanggal, Pelanggan, Perihal, Nilai, PIC, Status. Filter, cari, ekspor Excel |
| `/admin/quotations/new` | Form pembuat penawaran |
| `/admin/quotations/[id]` | Detail, pratinjau, dan aksi: Terbitkan, Salin Link, Kirim WA, Buat Revisi, tandai Menang/Kalah |
| `/q/[token]` | Halaman publik untuk pelanggan + tombol Unduh PDF |
| `/admin/quotations/stats` | Rekap nilai penawaran dan win rate |

Urutan field pada form mengikuti template Excel yang sudah dipakai: Tanggal → Kepada Yth → Attn → Perihal → tabel item → ringkasan → S&K.

Enam perilaku yang mempercepat pekerjaan sales:

1. Terbilang tampil langsung saat mengetik, read-only.
2. Nomor baris item dibangkitkan otomatis. Menutup temuan 6.
3. Baris baru muncul sendiri saat mengetik di baris terakhir.
4. S&K ter-prefill dari penawaran terakhir (Franco, Delivery Time, ToP jarang berubah).
5. Autocomplete item dari riwayat, lengkap dengan brand, type, dan harga terakhir.
6. Duplikat penawaran sebagai titik awal baru — namun **Perihal dan Attn sengaja dikosongkan** agar wajib diisi ulang. Menutup temuan 2.

Label S&K "Price include" diperbaiki agar konsisten dengan perhitungan (PPN ditambahkan di atas Jumlah). Menutup temuan 7.

## Bagian 3 — Dokumen publik, penanganan error, pengujian

Halaman publik:

- Token acak kriptografis, bukan ID berurutan.
- Hanya menampilkan penawaran berstatus terbit; draft tidak pernah dapat diakses publik.
- `@media print` CSS agar hasil "Unduh PDF" lewat print browser rapi.
- Mencatat `firstViewedAt` dan `viewCount`.
- `noindex` agar tidak terindeks mesin pencari.

Pengiriman WhatsApp memakai `wa.me/<nomor>?text=...` berisi salam, nomor penawaran, nilai, masa berlaku, dan tautan. `wa.me` tidak dapat melampirkan berkas, sehingga tautan adalah mekanisme yang tepat.

Penanganan error yang berisiko:

1. **Rebutan nomor** — dua pengguna menerbitkan bersamaan. Ditangani transaksi dengan increment atomik, plus satu kali retry bila unique constraint terlanggar. Ini satu-satunya jalur yang wajib benar sepenuhnya.
2. **Terbit tanpa item atau qty nol** — divalidasi sebelum nomor diambil agar nomor tidak terbuang.
3. **Edit setelah terbit** — dokumen terbit bersifat read-only; perubahan hanya melalui revisi.
4. **Pembulatan PPN** — dihitung `Decimal`, dibulatkan ke rupiah penuh sekali di akhir, lalu disimpan. Angka di layar, database, dan PDF identik.
5. **Tautan bocor** — token dapat dibangkitkan ulang sehingga tautan lama mati.

Pengujian dengan Vitest, fokus pada fungsi murni:

- `terbilang()` — `1.500.000`, `161.500.000`, `179.265.000`, "seribu" vs "satu ribu", belasan, nol di tengah (`2.000.007`), nilai nol.
- Penomoran — urut `001` → `002`, reset Januari, revisi tidak menaikkan counter, dan nomor melebar melewati `999`.
- Kalkulasi — subtotal, PPN, total beserta pembulatan.
- Satu integration test untuk race condition penomoran.

## Todos

1. `spec-doc` — Tulis spec ini ke `docs/superpowers/specs/2026-07-28-quotation-module-design.md` dan commit.
2. `vitest-setup` — Pasang Vitest dan skrip `test` di package.json.
3. `terbilang` — Implementasi `lib/terbilang.ts` beserta unit test lengkap.
4. `money` — Implementasi `lib/quotation-math.ts` (subtotal, PPN, total, pembulatan) beserta test.
5. `numbering` — Implementasi `lib/quotation-number.ts` (format nomor, bulan Romawi) beserta test.
6. `schema` — Tambah model Prisma dan migrasi.
7. `counter` — Layanan pengambilan nomor atomik beserta integration test.
8. `api` — Route API CRUD penawaran, terbitkan, revisi, ubah status, saran item.
9. `list-page` — Halaman daftar penawaran, filter, pencarian, ekspor Excel.
10. `form-page` — Form pembuat/penyunting penawaran beserta autocomplete dan terbilang langsung.
11. `detail-page` — Halaman detail beserta aksi terbit, revisi, salin tautan, kirim WA.
12. `public-page` — Halaman publik `/q/[token]` beserta print CSS dan pencatatan kunjungan.
13. `stats` — Rekap nilai penawaran dan win rate.
14. `settings` — Entri Setting untuk kode dokumen, kode perusahaan, tarif PPN, rekening, dan penanda tangan.
15. `import` — Impor 3 penawaran dan 1 baris log yang ada dari Excel sebagai data awal.
16. `verify` — Build, jalankan seluruh test, dan telusuri alur end-to-end.

## Catatan

- Tarif PPN disimpan sebagai setting. Nilai saat ini 11% mengikuti berkas; perlu dikonfirmasi terhadap tarif berlaku sebelum dipakai produksi.
- Data rekening dan penanda tangan ("Pasya, Sales Engineer") diambil dari berkas Excel dan dipindahkan ke Setting.
- Modul ini sengaja tidak tersambung ke `Inquiry` maupun `Product` sesuai keputusan; sambungan dapat ditambahkan kemudian tanpa mengubah model.
- Typo pada template lama ("Qutation Validity", "Coustic Soda", "Clorine Liquid") diperbaiki pada label sistem; nama material tetap mengikuti input pengguna.

## Penyimpangan saat implementasi

Dua hal berbeda dari rencana awal, keduanya disengaja:

1. **Rekap tidak dibuat sebagai halaman terpisah `/admin/quotations/stats`.** Angkanya ditempatkan langsung di atas daftar penawaran. Informasinya sama persis, tetapi pengguna tidak perlu berpindah halaman untuk melihatnya. Endpoint `/api/quotations/stats` tetap ada dan dapat dipakai bila kelak diperlukan halaman tersendiri.
2. **Uji integrasi penomoran bersifat opt-in.** Berkas `lib/quotation-service.integration.test.ts` hanya berjalan bila `RUN_DB_TESTS=1` dan database dapat dijangkau. Tanpa itu uji dilewati, sehingga `npm test` tetap dapat dijalankan di mesin tanpa database. Uji ini belum pernah dieksekusi karena database pada lingkungan pengembangan tidak dapat dihubungi (P1001).

## Yang belum terverifikasi

Database pada `DATABASE_URL` tidak dapat dijangkau selama implementasi (`P1001` ke `138.2.106.68:5441`), dan mesin pengembangan tidak memiliki Docker maupun PostgreSQL lokal. Karena itu hal berikut belum dijalankan sungguhan dan perlu dicoba di lingkungan yang memiliki database:

- Penerapan migrasi `20260728153000_add_quotation_module` ke database.
- Seed `npm run db:seed:quotations`.
- Alur penuh buat penawaran, terbitkan, bagikan tautan, dan buat revisi.
- Uji integrasi penomoran bersamaan (`RUN_DB_TESTS=1 npm test`).

### Yang tetap dapat diverifikasi tanpa database

- 58 unit test lulus, termasuk pemeriksaan hasil impor: ketiga penawaran memperoleh nomor `001`, `002`, `003` tanpa duplikat, nilainya utuh, dan terbilang sheet bahan kimia sudah sesuai totalnya sendiri.
- Berkas migrasi dibandingkan ulang terhadap selisih skema dan cocok persis, sehingga migrasi tidak tertinggal maupun tidak lengkap.
- `next build` sukses dengan seluruh rute terdaftar.
- Halaman publik menampilkan pesan ramah beserta nomor telepon ketika database tidak dapat dijangkau, bukan galat mentah.
