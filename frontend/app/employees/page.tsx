"use client";

import { useEffect, useState } from "react";
import { Plus, Wallet, ShieldAlert, BadgeCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { shortenAddress } from "@/lib/wallet";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/employees")
      .then((response) => setEmployees(response.data.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Karyawan">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Direktori Karyawan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Data sensitif (Phone, Address) di-encrypt di database menggunakan AES-256.
            </p>
          </div>
          <Button><Plus className="h-4 w-4" /> Tambah Karyawan</Button>
        </div>
        
        <div className="overflow-x-auto p-2">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Role Sistem</th>
                <th className="px-4 py-3 font-medium">Divisi & Jabatan</th>
                <th className="px-4 py-3 font-medium">Wallet Address</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading...</td>
                </tr>
              ) : employees.map((employee) => (
                <tr key={employee.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                  <td className="px-4 py-4 text-slate-500 font-mono text-xs">{employee.employeeCode}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">{employee.fullName}</p>
                    <p className="text-xs text-slate-500">{employee.user?.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {employee.user?.role ?? "No Login"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">{employee.position}</p>
                    <p className="text-xs text-slate-500">{employee.department}</p>
                  </td>
                  <td className="px-4 py-4">
                    {employee.user?.walletAddress ? (
                      <div className="flex items-center gap-1.5 text-indigo-600">
                        <BadgeCheck className="h-4 w-4 shrink-0" />
                        <span className="font-mono text-xs">{shortenAddress(employee.user.walletAddress)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <span className="text-xs">Belum di-assign</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${employee.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
