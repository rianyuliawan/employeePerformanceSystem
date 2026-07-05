"use client";

import { FormEvent, useEffect, useState } from "react";
import { Send, FileSignature, CheckCircle, ShieldCheck, FileSearch } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

const KPI_INDICATORS = [
  "Discipline",
  "Communication",
  "Leadership",
  "Teamwork",
  "Responsibility",
  "Productivity",
  "Initiative",
];

const STATUS_COLOR: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700 border-blue-200",
  Reviewed: "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  PromotionRecommended: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [role, setRole] = useState("Employee");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    // Load profile to know role
    api.get("/auth/profile").then((r) => setRole(r.data.data.role)).catch(() => {});

    // Load data
    Promise.all([
      api.get("/evaluations").then((r) => setEvaluations(r.data.data)),
      api.get("/employees").then((r) => setEmployees(r.data.data))
    ])
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const scores = KPI_INDICATORS.map((ind) => ({
      indicator: ind,
      score: Number(form.get(ind)),
      weight: ind === "Initiative" ? 0.10 : 0.15,
    }));

    try {
      await api.post("/evaluations", {
        employeeId: String(form.get("employeeId")),
        periodId: "period-1", // Simplified for demo
        comment: String(form.get("comment")),
        scores,
      });
      alert("Evaluasi berhasil disubmit ke database & blockchain!");
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + (e.response?.data?.message ?? e.message));
    }
  }

  async function handleAction(id: string, action: "review" | "approve" | "recommend-promotion") {
    try {
      await api.put(`/evaluations/${id}/${action}`);
      alert("Aksi berhasil diproses di blockchain!");
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + (e.response?.data?.message ?? e.message));
    }
  }

  async function handleVerify(id: string) {
    try {
      const res = await api.post(`/evaluations/${id}/verify`, {});
      const { verdict, storedHash, onChainHash, dbMatchesOnChain } = res.data.data;
      alert(
        `Hasil Verifikasi Evaluasi:\n\n${verdict}\n\n` +
        `Hash di database   : ${storedHash}\n` +
        `Hash di blockchain : ${onChainHash ?? "(tidak tersedia)"}\n` +
        `Cocok? ${dbMatchesOnChain === null ? "tidak dapat dicek" : dbMatchesOnChain ? "Ya" : "Tidak"}`
      );
    } catch (e: any) {
      alert("Gagal memverifikasi: " + (e.response?.data?.message ?? e.message));
    }
  }

  return (
    <AppShell title="Evaluasi Kinerja">
      {role === "Manager" && (
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setFormOpen(!formOpen)}>
            <FileSignature className="h-4 w-4" />
            {formOpen ? "Tutup Form" : "Buat Evaluasi Baru"}
          </Button>
        </div>
      )}

      {formOpen && role === "Manager" && (
        <form onSubmit={handleSubmit} className="mb-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-2">
          <div className="xl:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">Form Penilaian KPI</h3>
            <p className="text-sm text-slate-500">Evaluasi akan disimpan ke database (komentar di-encrypt) dan di-hash ke blockchain Sepolia.</p>
          </div>
          
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Pilih Karyawan</span>
            <select name="employeeId" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-indigo-500 focus:bg-white" required>
              <option value="">Pilih...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.fullName} ({e.position})</option>)}
            </select>
          </label>
          
          <div className="hidden xl:block"></div> {/* Spacer */}

          {KPI_INDICATORS.map((item) => (
            <label key={item} className="block">
              <span className="mb-2 block text-sm font-medium">{item} (0-100)</span>
              <input name={item} type="number" min="0" max="100" defaultValue="85" className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-indigo-500" required />
            </label>
          ))}

          <label className="block xl:col-span-2">
            <span className="mb-2 block text-sm font-medium">Komentar Evaluasi (Akan di-encrypt AES-256)</span>
            <textarea name="comment" rows={4} placeholder="Tulis catatan penting..." className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500" required />
          </label>
          
          <div className="xl:col-span-2 flex justify-end">
            <Button type="submit"><Send className="h-4 w-4" /> Submit ke Blockchain</Button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto p-2">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead>
            <tr className="text-slate-400">
              <th className="px-4 py-3 font-medium">Karyawan</th>
              <th className="px-4 py-3 font-medium">Skor Total</th>
              <th className="px-4 py-3 font-medium">Komentar (Decrypted)</th>
              <th className="px-4 py-3 font-medium">Blockchain Hash</th>
              <th className="px-4 py-3 font-medium">Status Dokumen</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Loading...</td></tr>
            ) : evaluations.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Belum ada evaluasi.</td></tr>
            ) : evaluations.map((ev) => (
              <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{ev.employee.fullName}</p>
                  <p className="text-xs text-slate-500">{ev.employee.position.name}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="font-bold text-indigo-600 text-lg">{ev.totalScore}</span>/100
                </td>
                <td className="px-4 py-4">
                  <p className="max-w-[250px] truncate text-slate-600" title={ev.comment}>
                    {ev.comment}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-indigo-600">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span className="font-mono text-xs">{ev.documentHash.slice(0, 16)}...</span>
                  </div>
                  <button
                    onClick={() => handleVerify(ev.id)}
                    className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"
                    title="Bandingkan hash di database dengan blockchain"
                  >
                    <FileSearch className="h-3 w-3" /> Verifikasi
                  </button>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[ev.status] ?? "bg-slate-100"}`}>
                    {ev.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {role === "HR" && ev.status === "Submitted" && (
                    <Button variant="outline" className="h-8 text-xs w-full" onClick={() => handleAction(ev.id, "review")}>
                      <CheckCircle className="h-3 w-3" /> Review
                    </Button>
                  )}
                  {role === "HR" && ev.status === "Reviewed" && (
                    <Button variant="primary" className="h-8 text-xs bg-green-600 hover:bg-green-700 w-full" onClick={() => handleAction(ev.id, "approve")}>
                      <ShieldCheck className="h-3 w-3" /> Approve
                    </Button>
                  )}
                  {role === "Manager" && ev.status === "Approved" && (
                    <Button variant="secondary" className="h-8 text-xs w-full" onClick={() => handleAction(ev.id, "recommend-promotion")}>
                      Rekomendasikan Promosi
                    </Button>
                  )}
                  {/* View only modes for others */}
                  {(role === "Employee" || role === "Director" || 
                    (role === "HR" && ["Approved", "PromotionRecommended"].includes(ev.status)) ||
                    (role === "Manager" && ["Submitted", "Reviewed", "PromotionRecommended"].includes(ev.status))) && (
                    <span className="text-xs text-slate-400 italic">No action needed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
