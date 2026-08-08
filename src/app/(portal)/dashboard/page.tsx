import { redirect } from "next/navigation";

/** /dashboard adalah area kelola; halaman kerjanya dimulai dari penawaran. */
export default function DashboardIndexPage() {
  redirect("/dashboard/quotations");
}
