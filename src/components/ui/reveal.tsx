"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

import {
  REVEAL_DISTANCE,
  REVEAL_DURATION_MS,
  REVEAL_EASE,
} from "@/components/ui/reveal-timing";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Milidetik. Pakai `revealDelay(index)` dari `reveal-timing` untuk kelompok. */
  delay?: number;
  /** Tag yang dirender, default `div`. */
  as?: ElementType;
}

/**
 * Memunculkan elemen saat masuk layar: geser naik 16px + fade.
 *
 * Komponen ini merender elemennya sendiri, bukan membungkusnya. Menambah satu
 * `<div>` pembungkus akan menjadikan pembungkus itu sebagai grid/flex item,
 * sehingga tinggi dan perataan kartu ikut berubah.
 *
 * Keadaan tersembunyi dipasang lewat JavaScript, bukan ditulis di markup awal.
 * Dengan begitu bila JavaScript gagal, lambat, atau dimatikan, seluruh isi
 * tetap terlihat dan tetap terbaca mesin pencari.
 */
export function Reveal({ children, className, delay = 0, as }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /**
     * Elemen yang sudah berada di viewport saat hidrasi berarti sudah dilukis
     * dan sudah dilihat pengunjung. Menyembunyikannya sekarang hanya
     * menghasilkan kedipan "tampil - hilang - muncul", jadi dibiarkan apa
     * adanya; isi paruh atas memakai animasi muat CSS (`.reveal-load`).
     */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    el.style.opacity = "0";
    el.style.transform = `translateY(${REVEAL_DISTANCE})`;
    el.style.willChange = "opacity, transform";

    let timer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const timing = `${REVEAL_DURATION_MS}ms ${REVEAL_EASE} ${delay}ms`;
        el.style.transition = `opacity ${timing}, transform ${timing}`;
        el.style.opacity = "1";
        el.style.transform = "none";

        // `will-change` yang dibiarkan menetap memaksa compositor menahan layer
        // terpisah selamanya; dilepas begitu animasinya selesai.
        timer = window.setTimeout(() => {
          el.style.willChange = "";
        }, REVEAL_DURATION_MS + delay);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay]);

  // `as` hanya memilih nama tag; propertinya sama dengan div.
  const Tag = (as ?? "div") as "div";

  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
