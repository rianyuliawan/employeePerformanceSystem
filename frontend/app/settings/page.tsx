"use client";

import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck, Wallet, RefreshCw, KeyRound, UserCog } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/profile").then((r) => setRole(r.data.data.role)).catch(() => {});
    fetchData();
  }, []);

  function fetchData() {
    setLoading(true);
    // Since we don't have a dedicated users endpoint, we will map employees to their user account.
    // In a real app we would have GET /users
    api.get("/employees")
      .then((r) => {
        const u = r.data.data.map((e: any) => e.user).filter(Boolean);
        setUsers(u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function handleAssign(event: FormEvent<HTMLFormElement>, userId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const address = String(form.get("walletAddress"));

    try {
      await api.post("/employees/assign-wallet", {
        userId,
        walletAddress: address,
      });
      alert("Wallet berhasil diassign!");
      fetchData();
    } catch (e: any) {
      alert("Error: " + (e.response?.data?.message ?? e.message));
    }
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword"));
    const newPassword = String(data.get("newPassword"));
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      alert("Password berhasil diubah.");
      form.reset();
    } catch (e: any) {
      alert("Error: " + (e.response?.data?.message ?? e.message));
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const userId = String(data.get("userId"));
    const newPassword = String(data.get("resetNewPassword"));
    try {
      const res = await api.put("/auth/reset-password", { userId, newPassword });
      alert(res.data.message ?? "Password user berhasil di-reset.");
      form.reset();
    } catch (e: any) {
      alert("Error: " + (e.response?.data?.message ?? e.message));
    }
  }

  return (
    <AppShell title="Pengaturan Sistem">
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <KeyRound className="h-5 w-5 text-indigo-600" />
            Ganti Password Saya
          </h3>
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            <input
              name="currentPassword"
              type="password"
              placeholder="Password saat ini"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              required
            />
            <input
              name="newPassword"
              type="password"
              placeholder="Password baru (min. 6 karakter)"
              minLength={6}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              required
            />
            <Button type="submit" className="w-full">Ganti Password</Button>
          </form>
        </div>

        {(role === "HR" || role === "Director") && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <UserCog className="h-5 w-5 text-indigo-600" />
              Reset Password User Lain
            </h3>
            <p className="mt-1 text-xs text-slate-500">Untuk user yang lupa password. Tidak perlu email — password baru langsung aktif.</p>
            <form onSubmit={handleResetPassword} className="mt-4 space-y-3">
              <select
                name="userId"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                required
              >
                <option value="">Pilih user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <input
                name="resetNewPassword"
                type="password"
                placeholder="Password baru untuk user ini (min. 6 karakter)"
                minLength={6}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
                required
              />
              <Button type="submit" variant="secondary" className="w-full">Reset Password</Button>
            </form>
          </div>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-900">
          <ShieldCheck className="h-5 w-5" />
          Manajemen Wallet Karyawan
        </h3>
        <p className="mt-2 text-sm text-indigo-700">
          Sebagai HR, Anda bertanggung jawab untuk mendaftarkan wallet address masing-masing karyawan/manager/director. 
          Tanpa wallet yang terdaftar, mereka tidak akan bisa menandatangani transaksi ke blockchain.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto p-2">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="text-slate-400">
              <th className="px-4 py-3 font-medium">Nama Akun</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Wallet Address Terdaftar</th>
              {role === "HR" && <th className="px-4 py-3 font-medium">Assign Wallet Baru</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-400">Belum ada user.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {u.walletAddress ? (
                    <div className="flex items-center gap-1.5 text-indigo-600">
                      <Wallet className="h-4 w-4 shrink-0" />
                      <span className="font-mono text-xs font-medium">{u.walletAddress}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-500 italic">Belum ada wallet</span>
                  )}
                </td>
                {role === "HR" && (
                  <td className="px-4 py-4">
                    <form onSubmit={(e) => handleAssign(e, u.id)} className="flex items-center gap-2">
                      <input 
                        name="walletAddress"
                        type="text" 
                        placeholder="0x..." 
                        defaultValue={u.walletAddress ?? ""}
                        className="h-9 w-[200px] rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-indigo-500"
                        required 
                      />
                      <Button type="submit" variant="outline" className="h-9 px-3 text-xs">
                        <RefreshCw className="h-3 w-3" /> Update
                      </Button>
                    </form>
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
