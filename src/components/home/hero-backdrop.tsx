"use client";

import { useEffect, useRef } from "react";

/**
 * Encode asli dipakai apa adanya. Setiap percobaan re-encode justru
 * menghasilkan berkas LEBIH besar (CRF 32 -> 3,6 MB, CRF 36 -> 3,0 MB, versus
 * 2,35 MB asli) sekaligus menurunkan kualitas karena sumbernya sudah lossy.
 */
const SOURCES = [
  { src: "/videos/vedio.webm", type: "video/webm" },
  { src: "/videos/vedio.mp4", type: "video/mp4" },
];

const POSTER = "/images/home/hero-poster.jpg";

/**
 * Scrim navy gelap di atas video — bukan hiasan, tapi syarat keterbacaan.
 *
 * Area paling terang video (langit pada detik ~23) mencapai luminansi 0,58.
 * Teks putih butuh latar <= 0,183 untuk 4,5:1, jadi tanpa scrim judul hero
 * hanya mendapat 1,75:1 alias tak terbaca.
 *
 * Nilainya 0,66, bukan 0,62. Sapuan 35 frame sepanjang video menunjukkan 0,62
 * menyisakan margin cuma 4,55:1 pada paragraf dan 4,57:1 pada label
 * ENGINEERING — lolos di atas kertas, tapi terlalu rapat dengan ambang 4,5:1
 * untuk selisih render antar peramban. Di 0,66 titik terburuk naik ke ~5,2:1
 * sementara videonya tetap terlihat jelas.
 *
 * Dataran itu sengaja direntang dari 22% sampai 84% supaya seluruh blok teks
 * yang terpusat secara vertikal berdiri di atas nilai terjaga yang sama; tepi
 * atas dan bawah digelapkan untuk menyatu dengan header dan pembatas section.
 */
const SCRIM =
  "bg-[linear-gradient(180deg,rgba(1,17,40,0.84)_0%,rgba(1,17,40,0.66)_22%,rgba(1,17,40,0.66)_84%,rgba(1,17,40,0.88)_100%)]";

export function HeroBackdrop() {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // React tidak selalu meneruskan `muted` sebagai properti, padahal peramban
    // hanya mengizinkan autoplay bila video benar-benar bisu.
    video.muted = true;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Di bawah 768px hero berbentuk potret sedangkan rekamannya lanskap, jadi
    // videonya akan terpotong ekstrem. Poster diam lebih rapi sekaligus
    // menghemat 2,35 MB kuota dan baterai — `preload="none"` menjamin tidak ada
    // satu byte pun video terunduh selama `play()` tidak pernah dipanggil.
    const wide = window.matchMedia("(min-width: 768px)");

    let visible = true;

    const update = () => {
      if (!visible || !wide.matches || motion.matches) {
        video.pause();
        return;
      }
      if (video.preload !== "auto") video.preload = "auto";
      void video.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    observer.observe(video);

    motion.addEventListener("change", update);
    wide.addEventListener("change", update);
    update();

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      wide.removeEventListener("change", update);
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 -z-[110] h-full w-full object-cover"
        poster={POSTER}
        preload="none"
        loop
        muted
        playsInline
      >
        {SOURCES.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-[105] ${SCRIM}`} />
    </>
  );
}
