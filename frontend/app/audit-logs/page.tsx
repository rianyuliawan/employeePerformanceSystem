import { AppShell } from "@/components/layout/AppShell";

export default function AuditLogsPage() {
  return (
    <AppShell title="Audit Logs">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Application Audit Logs</h2>
        <table className="mt-5 w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr><th className="border-b border-line py-3">User</th><th className="border-b border-line py-3">Activity</th><th className="border-b border-line py-3">IP</th><th className="border-b border-line py-3">Date</th></tr>
          </thead>
          <tbody>
            <tr><td className="border-b border-line py-3">System</td><td className="border-b border-line py-3">Demo initialized</td><td className="border-b border-line py-3">127.0.0.1</td><td className="border-b border-line py-3">Today</td></tr>
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}

