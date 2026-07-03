import type { ReactNode } from "react";

export function StatCard({ title, value, icon }: { title: string; value: string | number; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="text-primary">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-normal">{value}</p>
    </div>
  );
}

