/**
 * Konten FAQ untuk /faqs — PT Multi Enviro Tirta Teknologi (METITO).
 * Setiap jawaban adalah teks polos (tanpa HTML), dikelompokkan dalam tab
 * kategori yang dirender oleh `src/components/faqs/faq-section.tsx`.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: readonly FaqItem[];
};

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    id: "produk",
    label: "Produk & Layanan",
    items: [
      {
        question: "Apa saja lini bisnis METITO?",
        answer:
          "METITO (PT Multi Enviro Tirta Teknologi) memiliki empat lini bisnis utama: Chemical Supply, Engineering Services, Equipment Supply, dan Spare Parts Supply. Keempatnya dirancang sebagai solusi satu atap untuk kebutuhan air, industri, dan pertambangan — mulai dari pengadaan bahan kimia dan peralatan hingga jasa rekayasa dan suku cadang.",
      },
      {
        question: "Produk apa saja yang tersedia di METITO?",
        answer:
          "Produk unggulan kami mencakup resin kation/anion, filter media (sand, carbon, anthracite, gravel), membrane RO/UF/NF, activated carbon, bahan kimia seperti PAC, tawas, caustic soda, dan antiscalant RO, berbagai jenis pompa (high pressure, feed, dosing, transfer, submersible), blower, multi media filter, softener, RO system, demin plant, chlorine dioxide generator, instrumentasi (pH, ORP, conductivity, flow meter), cartridge filter, valve, serta spare part industri seperti mechanical seal, gasket, bearing, carbon brush, conveyor belt, idler roller, crusher parts, dan vibrating screen.",
      },
      {
        question: "Layanan engineering apa saja yang ditawarkan?",
        answer:
          "Tim engineering kami menangani design WTP/WWTP/STP, RO system, demineralization plant, dan chlorine dioxide system; installation & commissioning; chemical dosing system; serta fabrikasi tangki, piping, dan struktur baja. Kami juga menyediakan shutdown & turnaround support serta manpower supply (teknisi dan engineer) untuk kebutuhan proyek Anda.",
      },
      {
        question: "Apakah METITO melayani maintenance sistem pengolahan air?",
        answer:
          "Ya. Kami menyediakan preventive dan corrective maintenance, plant audit, troubleshooting, hingga kontrak annual maintenance agreement (AMA) untuk menjaga keandalan operasional sistem pengolahan air Anda dalam jangka panjang.",
      },
      {
        question: "Apakah konsultasi teknis dikenakan biaya?",
        answer:
          "Tidak. Konsultasi teknis awal kami berikan secara gratis. Sampaikan kebutuhan atau permasalahan sistem Anda melalui WhatsApp 0812-1760-3950 atau email info@metito.id, dan tim teknis kami akan membantu merekomendasikan solusi yang efektif dan efisien.",
      },
      {
        question: "Industri apa saja yang dilayani METITO?",
        answer:
          "Kami melayani sektor Mining, Petrochemical, Oil & Gas, Palm Oil Refinery, Water Treatment, dan Power Plants — baik untuk kebutuhan industri, komersial, maupun institusi.",
      },
    ],
  },
  {
    id: "pemesanan",
    label: "Pemesanan & Pengiriman",
    items: [
      {
        question: "Bagaimana cara meminta penawaran harga?",
        answer:
          "Hubungi kami melalui WhatsApp di 0812-1760-3950 atau 0821-5555-1235, telepon 0853-9954-4912, atau email ke info@metito.id. Sertakan spesifikasi produk atau kebutuhan layanan Anda, dan tim kami akan menyiapkan penawaran resmi.",
      },
      {
        question: "Di mana area layanan dan pengiriman METITO?",
        answer:
          "Kami berbasis di Kabupaten Gowa, Sulawesi Selatan, dan melayani pengiriman produk serta layanan engineering ke seluruh Indonesia.",
      },
      {
        question: "Kapan jam operasional METITO?",
        answer:
          "Kami beroperasi Senin sampai Jumat, pukul 08.00–17.00 WITA. Pesan yang masuk di luar jam operasional melalui WhatsApp atau email akan kami tindak lanjuti pada hari kerja berikutnya.",
      },
      {
        question: "Bagaimana dukungan purna jual METITO?",
        answer:
          "Kami mendampingi pelanggan setelah pembelian — mulai dari installation & commissioning, troubleshooting, preventive/corrective maintenance, penyediaan spare parts, hingga kontrak annual maintenance agreement (AMA). Membangun kemitraan jangka panjang yang mendukung efisiensi OpEx dan CapEx pelanggan adalah inti cara kami bekerja.",
      },
    ],
  },
  {
    id: "perusahaan",
    label: "Perusahaan",
    items: [
      {
        question: "Apakah METITO perusahaan yang legal dan terdaftar?",
        answer:
          "Ya. PT Multi Enviro Tirta Teknologi terdaftar resmi dengan NIB 2310250113814 dan berstatus penanaman modal dalam negeri (PMDN) dengan skala Usaha Kecil.",
      },
      {
        question: "Di mana lokasi kantor METITO?",
        answer:
          "Kantor kami berada di Bonto Bila, Desa/Kelurahan Lembang Parang, Kecamatan Barombong, Kabupaten Gowa, Sulawesi Selatan 90225. Informasi lebih lengkap tersedia di www.metito.id.",
      },
    ],
  },
];
