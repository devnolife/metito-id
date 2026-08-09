import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/portal/sidebar";
import { Topbar } from "@/components/portal/topbar";
import { getSession } from "@/lib/portal/session.server";

export const metadata: Metadata = {
  title: "Dashboard Internal | METITO",
  description: "Ringkasan penawaran, penomoran surat, dan CRM PT. METITO.",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = {
    name: session.name,
    email: session.email,
    company: session.company,
    initials: session.initials,
    isAdmin: session.role === "ADMIN",
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      <Sidebar className="hidden lg:flex" isAdmin={session.role === "ADMIN"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
