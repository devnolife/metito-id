import type { Metadata } from "next";

import { Toaster } from "@/components/legacy-ui/toaster";

export const metadata: Metadata = {
  title: "Kelola | METITO",
  robots: { index: false, follow: false },
};

/**
 * Area kelola (CRUD) — halaman konsol admin lama yang dipindahkan ke dalam
 * shell dashboard baru. Konten masih memakai tema gelap "instrument panel"
 * (admin-theme + admin-shell dari legacy.css) sampai di-port bertahap ke UI
 * terang; wrapper ini menjaga tampilannya tetap koheren di dalam shell.
 */
export default function KelolaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme admin-shell min-h-full overflow-hidden rounded-md border border-line">
      {children}
      <Toaster />
    </div>
  );
}
