import { LegalSection } from "@/components/shared/legal-section";

/**
 * `/imprint` — second block ("Ketentuan Penggunaan").
 *
 * Uses the shared `<LegalSection/>` shell (identical chain to `/privacy`,
 * `/terms`, `/terms-suppliers`):
 *
 *   section .imprint_second_wrapper   padding-inline 5%
 *     div .imprint_second_component   padding 0 32px; border 0/1/1/1 border-line
 *       div .imprint_second_header    max-width 584px; padding 64px 0; gap 16px
 *         h1  .heading-style-h1       56/61.6 · 500 · tracking-h1 · text-navy
 *         div .imprint_second_text    max-width 576px · 16/24
 *
 * Content: generic disclaimer (tanggung jawab konten, hak cipta, tautan
 * eksternal) untuk website PT Multi Enviro Tirta Teknologi (METITO).
 */

const HEADING = "Ketentuan Penggunaan";

export function ImprintUsageSection() {
  return (
    <LegalSection heading={HEADING}>
      <div className="max-w-[36rem]">
        Seluruh informasi pada website ini disusun dengan cermat dan diperbarui secara berkala.
        Meskipun demikian, PT Multi Enviro Tirta Teknologi (METITO) tidak menjamin keakuratan,
        kelengkapan, dan keaktualan seluruh konten yang ditampilkan. Konten pada website ini
        bersifat informasi umum dan bukan merupakan penawaran yang mengikat; spesifikasi produk dan
        layanan dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.
        <br />
        <br />
        Seluruh konten pada website ini — termasuk teks, gambar, logo, dan materi lainnya —
        merupakan milik PT Multi Enviro Tirta Teknologi atau pihak yang memberikan lisensi kepada
        kami, dan dilindungi oleh ketentuan hak cipta yang berlaku. Dilarang memperbanyak,
        mendistribusikan, atau menggunakan konten tersebut untuk kepentingan komersial tanpa izin
        tertulis dari kami.
        <br />
        <br />
        Website ini dapat memuat tautan ke situs pihak ketiga. Kami tidak memiliki kendali atas
        konten situs eksternal tersebut dan tidak bertanggung jawab atas isi maupun kebijakan
        privasinya. Kami juga mengingatkan bahwa transmisi data melalui internet (misalnya
        komunikasi melalui email) dapat memiliki celah keamanan; perlindungan data secara mutlak
        dari akses pihak ketiga tidak dapat dijamin sepenuhnya.
      </div>
    </LegalSection>
  );
}
