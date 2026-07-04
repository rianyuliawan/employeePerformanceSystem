"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";

type AuditLogEntry = {
  id: string;
  activity: string;
  detail: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { id: string; name: string; role: string } | null;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/audit-logs")
      .then((r) => setLogs(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Audit Logs">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Application Audit Logs</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="border-b border-line py-3">User</th>
                <th className="border-b border-line py-3">Activity</th>
                <th className="border-b border-line py-3">Detail</th>
                <th className="border-b border-line py-3">IP</th>
                <th className="border-b border-line py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">Belum ada aktivitas tercatat.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id}>
                  <td className="border-b border-line py-3">{log.user?.name ?? "System"}</td>
                  <td className="border-b border-line py-3 font-mono text-xs">{log.activity}</td>
                  <td className="border-b border-line py-3 text-slate-500">{log.detail ?? "-"}</td>
                  <td className="border-b border-line py-3 font-mono text-xs">{log.ipAddress ?? "-"}</td>
                  <td className="border-b border-line py-3">{new Date(log.createdAt).toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
