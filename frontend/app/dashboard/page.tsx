"use client";

import { useEffect, useState } from "react";
import {
  Activity, ClipboardCheck, Clock, ShieldCheck, TrendingUp, UsersRound,
  ExternalLink, Hash
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";

type DashboardData = {
  totalEmployee: number;
  totalEvaluation: number;
  pendingPromotion: number;
  latestTransaction: Array<{
    evaluationId: string | null;
    transactionHash: string;
    action: string;
    walletAddress: string;
    network: string;
    status: string;
    createdAt: string;
  }>;
};

const ACTION_LABEL: Record<string, string> = {
  submitEvaluation: "Submit Evaluasi",
  reviewEvaluation: "Review Evaluasi",
  approveEvaluation: "Approve Evaluasi",
  recommendPromotion: "Rekomendasikan Promosi",
  approvePromotion: "Approve Promosi",
};

const STATUS_COLOR: Record<string, string> = {
  Success: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed:  "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalEmployee: 0, totalEvaluation: 0, pendingPromotion: 0, latestTransaction: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then((r) => setData(r.data.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Karyawan",      value: data.totalEmployee,    icon: UsersRound,    color: "text-indigo-600",  bg: "bg-indigo-50" },
    { label: "Total Evaluasi",      value: data.totalEvaluation,  icon: ClipboardCheck,color: "text-blue-600",    bg: "bg-blue-50" },
    { label: "Pending Aksi",        value: data.pendingPromotion, icon: Clock,         color: "text-amber-600",   bg: "bg-amber-50" },
    { label: "Blockchain Sync",     value: data.latestTransaction.filter(t => t.status === "Success").length, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <AppShell title="Dashboard">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{s.label}</p>
                <div className={`rounded-xl ${s.bg} p-2`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {loading ? "—" : s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Blockchain Activity */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Aktivitas Blockchain Terbaru</h2>
        </div>

        {data.latestTransaction.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <Hash className="h-10 w-10 mb-3" />
            <p>Belum ada transaksi blockchain.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="px-6 py-3 text-left font-medium">Aksi</th>
                  <th className="px-6 py-3 text-left font-medium">Transaction Hash</th>
                  <th className="px-6 py-3 text-left font-medium">Wallet</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {data.latestTransaction.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium">
                      {ACTION_LABEL[item.action] ?? item.action}
                    </td>
                    <td className="px-6 py-3">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${item.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-mono text-xs text-indigo-600 hover:underline"
                      >
                        {item.transactionHash.slice(0, 18)}...
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">
                      {item.walletAddress.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[item.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(item.createdAt).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Info box */}
      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-800">Smart Contract: 0x4318...E7Af</p>
            <a
              href="https://sepolia.etherscan.io/address/0x4318928514534c6f2C7a7e9262d82F4569c1E7Af"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:underline"
            >
              Lihat di Sepolia Etherscan →
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
