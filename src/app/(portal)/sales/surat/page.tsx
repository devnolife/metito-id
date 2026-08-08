import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/portal/badge";
import { Card, CardHeader } from "@/components/portal/card";
import { BarChart } from "@/components/portal/charts";
import { DbOffline, StatTile } from "@/components/portal/internal";
import { PageHeading } from "@/components/portal/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LetterStatus, LetterType } from "@prisma/client";
import { db } from "@/lib/db";
import { LETTER_STATUS_LABEL } from "@/lib/crm-labels";
import { DIVISION_LABEL, formatTanggal, safeQuery } from "@/lib/portal/internal";

export const metadata: Metadata = { title: "Nomor Surat | METITO" };

const STATUS_TONE: Record<LetterStatus, "neutral" | "blue" | "green" | "red"> = {
  DRAFT: "neutral",
  TERKIRIM: "blue",
  DISETUJUI: "green",
  DIBATALKAN: "red",
};

/** Keterangan jenis surat, mengikuti sheet "Generator Nomor Surat". */
const TYPE_LABEL: Record<LetterType, string> = {
  SPH: "Surat Penawaran Harga",
  SPK: "Surat Perintah Kerja",
  SJ: "Surat Jalan",
  BA: "Berita Acara",
  MOU: "Perjanjian Kerja Sama",
  SK: "Surat Keterangan",
  MEMO: "Memo Internal",
  SI: "Surat Izin / Permohonan",
  SL: "Surat Lainnya",
};

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default async function SuratPage() {
  const letters = await safeQuery(() =>
    db.letter.findMany({
      orderBy: [{ letterDate: "desc" }, { seq: "desc" }],
      include: { account: { select: { name: true } } },
    })
  );

  if (!letters) {
    return (
      <div>
        <PageHeading
          title="Nomor Surat"
          description="Register penomoran seluruh surat keluar PT. METITO."
        />
        <DbOffline module="nomor surat" />
      </div>
    );
  }

  const now = new Date();
  const thisYear = letters.filter((l) => l.year === now.getFullYear());
  const thisMonth = thisYear.filter(
    (l) => new Date(l.letterDate).getMonth() === now.getMonth()
  );

  // Surat per bulan pada tahun berjalan (mengikuti panel statistik sheet Dashboard).
  const perMonth = BULAN.map((label, m) => ({
    label,
    value: thisYear.filter((l) => new Date(l.letterDate).getMonth() === m).length,
  })).slice(0, now.getMonth() + 1);

  const typeCount = new Map<LetterType, number>();
  for (const l of letters) typeCount.set(l.type, (typeCount.get(l.type) ?? 0) + 1);
  const topTypes = [...typeCount.entries()].sort((a, b) => b[1] - a[1]);

  const recent = letters.slice(0, 50);

  return (
    <div className="space-y-6">
      <PageHeading
        title="Nomor Surat"
        description={`Register permanen seluruh surat keluar · format NNN/JENIS-Metito[-DIV]/BULAN/TAHUN`}
        action={
          <Link
            href="/dashboard/letters"
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-brand px-4 py-2.5 text-regular font-medium text-[#fff] transition-colors hover:bg-[#d64300]"
          >
            Terbitkan nomor baru
          </Link>
        }
      />

      {/* statistik — memetakan panel "STATISTIK NOMOR SURAT" pada Excel */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total surat diterbitkan" value={letters.length} accent="neutral" />
        <StatTile label="Surat tahun ini" value={thisYear.length} hint={`Tahun ${now.getFullYear()}, counter reset tiap Januari`} accent="blue" />
        <StatTile label="Surat bulan ini" value={thisMonth.length} hint={`${BULAN[now.getMonth()]} ${now.getFullYear()}`} accent="brand" />
        <StatTile
          label="Jenis terbanyak"
          value={topTypes[0] ? topTypes[0][0] : "—"}
          hint={topTypes[0] ? `${topTypes[0][1]} surat · ${TYPE_LABEL[topTypes[0][0]]}` : "Belum ada surat"}
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* register */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Register surat keluar"
            subtitle="Log Nomor Surat — nomor yang terbit tidak pernah digunakan ulang"
            action={
              <Link href="/dashboard/letters" className="text-small text-blue hover:underline">
                Kelola di konsol admin
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-5">Nomor</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Perihal</TableHead>
                  <TableHead>Tujuan</TableHead>
                  <TableHead className="pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      Register masih kosong. Terbitkan nomor lewat konsol admin.
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="whitespace-nowrap px-5">
                        <span className="font-mono text-small font-medium text-navy">{l.number}</span>
                        <p className="mt-0.5 text-tiny text-muted-foreground">
                          {TYPE_LABEL[l.type]}
                          {l.division ? ` · ${DIVISION_LABEL[l.division]}` : ""}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatTanggal(l.letterDate)}</TableCell>
                      <TableCell className="max-w-[18rem] truncate" title={l.subject}>
                        {l.subject}
                      </TableCell>
                      <TableCell className="max-w-[12rem] truncate" title={l.recipient}>
                        {l.account?.name ?? l.recipient}
                      </TableCell>
                      <TableCell className="pr-5">
                        <Badge tone={STATUS_TONE[l.status]}>{LETTER_STATUS_LABEL[l.status]}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* samping: tren + jenis */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Surat per bulan" subtitle={`Tahun ${now.getFullYear()}`} />
            <div className="p-4">
              {thisYear.length === 0 ? (
                <p className="py-8 text-center text-small text-muted-foreground">Belum ada surat tahun ini.</p>
              ) : (
                <BarChart series={perMonth} height={200} color="var(--ac-blue)" />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Per jenis surat" subtitle="Seluruh register" />
            <ul className="divide-y divide-border">
              {topTypes.length === 0 ? (
                <li className="px-5 py-8 text-center text-small text-muted-foreground">Belum ada data.</li>
              ) : (
                topTypes.map(([type, count]) => (
                  <li key={type} className="flex items-center justify-between px-5 py-3 text-small">
                    <span className="text-body">
                      <span className="font-mono font-medium text-navy">{type}</span>
                      <span className="ml-2 text-muted-foreground">{TYPE_LABEL[type]}</span>
                    </span>
                    <span className="font-medium text-navy">{count}</span>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
