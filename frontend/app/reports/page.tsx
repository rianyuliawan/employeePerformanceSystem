import { Download } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

export default function ReportsPage() {
  return (
    <AppShell title="Reports">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Reports</h2>
        <p className="mt-1 text-sm text-slate-500">Export laporan evaluasi, promosi, dan transaksi blockchain.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button><Download className="h-4 w-4" /> Export PDF</Button>
          <Button variant="outline"><Download className="h-4 w-4" /> Export Excel</Button>
        </div>
      </section>
    </AppShell>
  );
}

