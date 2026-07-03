"use client";

import { FormEvent, useEffect, useState } from "react";
import { Send, TrendingUp, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    api.get("/auth/profile").then((r) => setRole(r.data.data.role)).catch(() => {});

    Promise.all([
      api.get("/promotions").then((r) => setPromotions(r.data.data)),
      api.get("/evaluations").then((r) => setEvaluations(r.data.data)),
      api.get("/employees/positions").then((r) => setPositions(r.data.data)),
    ])
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const evalId = String(form.get("evaluationId"));
    const targetPosId = String(form.get("targetPositionId"));
    
    // Find the evaluation to get employeeId
    const evaluation = evaluations.find(e => e.id === evalId);
    if (!evaluation) return alert("Evaluasi tidak valid.");

    try {
      await api.post("/promotions", {
        evaluationId: evalId,
        employeeId: evaluation.employeeId,
        targetPositionId: targetPosId,
        reason: String(form.get("reason")),
      });
      alert("Pengajuan promosi berhasil dibuat!");
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + (e.response?.data?.message ?? e.message));
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      await api.put(`/promotions/${id}/${action}`);
      alert(`Promosi berhasil di-${action === "approve" ? "setujui" : "tolak"} di blockchain!`);
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + (e.response?.data?.message ?? e.message));
    }
  }

  return (
    <AppShell title="Manajemen Promosi">
      {role === "Manager" && (
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setFormOpen(!formOpen)}>
            <TrendingUp className="h-4 w-4" />
            {formOpen ? "Tutup Form" : "Buat Pengajuan Promosi"}
          </Button>
        </div>
      )}

      {formOpen && role === "Manager" && (
        <form onSubmit={handleSubmit} className="mb-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-2">
          <div className="xl:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">Form Pengajuan Promosi</h3>
            <p className="text-sm text-slate-500">Pilih evaluasi yang sudah berstatus 'Approved' oleh HR.</p>
          </div>
          
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Pilih Evaluasi (Approved)</span>
            <select name="evaluationId" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-indigo-500 focus:bg-white" required>
              <option value="">Pilih...</option>
              {evaluations.filter(e => e.status === "Approved" || e.status === "PromotionRecommended").map(e => (
                <option key={e.id} value={e.id}>{e.employee.fullName} - Score: {e.totalScore}</option>
              ))}
            </select>
          </label>
          
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Target Jabatan Baru</span>
            <select name="targetPositionId" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-indigo-500 focus:bg-white" required>
              <option value="">Pilih Jabatan...</option>
              {positions.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Level {p.level})</option>
              ))}
            </select>
          </label>

          <label className="block xl:col-span-2">
            <span className="mb-2 block text-sm font-medium">Alasan Promosi (Akan di-encrypt AES-256)</span>
            <textarea name="reason" rows={3} placeholder="Jelaskan alasan merekomendasikan karyawan ini..." className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500" required />
          </label>
          
          <div className="xl:col-span-2 flex justify-end">
            <Button type="submit"><Send className="h-4 w-4" /> Ajukan Promosi</Button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto p-2">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead>
            <tr className="text-slate-400">
              <th className="px-4 py-3 font-medium">Karyawan</th>
              <th className="px-4 py-3 font-medium">Skor Evaluasi</th>
              <th className="px-4 py-3 font-medium">Target Jabatan</th>
              <th className="px-4 py-3 font-medium">Pengaju</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {role === "Director" && <th className="px-4 py-3 font-medium">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Loading...</td></tr>
            ) : promotions.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Belum ada pengajuan promosi.</td></tr>
            ) : promotions.map((prom) => (
              <tr key={prom.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{prom.employee?.fullName}</p>
                  <p className="text-xs text-slate-500">{prom.employee?.department?.name}</p>
                </td>
                <td className="px-4 py-4 font-medium text-slate-900">
                  {prom.evaluation?.totalScore}
                </td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-indigo-700">{prom.targetPosition?.name}</span>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {prom.requestedBy?.name}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[prom.status] ?? "bg-slate-100"}`}>
                    {prom.status}
                  </span>
                </td>
                {role === "Director" && (
                  <td className="px-4 py-4 flex gap-2">
                    {prom.status === "Pending" ? (
                      <>
                        <Button variant="primary" className="h-8 w-8 !p-0 bg-green-600 hover:bg-green-700" onClick={() => handleAction(prom.id, "approve")} title="Approve Promosi (Blockchain)">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" className="h-8 w-8 !p-0" onClick={() => handleAction(prom.id, "reject")} title="Tolak Promosi">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    ) : prom.status === "Approved" ? (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-medium">On-chain</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No action</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
