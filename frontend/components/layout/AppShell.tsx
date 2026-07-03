"use client";

import {
  BarChart3, Blocks, ClipboardCheck, FileText, LayoutDashboard,
  LogOut, Settings, ShieldCheck, TrendingUp, UsersRound, Wallet, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { connectWallet, switchToSepolia, SEPOLIA_CHAIN_ID, shortenAddress, isMetaMaskInstalled } from "@/lib/wallet";
import { api } from "@/lib/api";

type UserInfo = { id: string; name: string; email: string; role: string; walletAddress?: string };

const navByRole: Record<string, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  HR: [
    { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
    { href: "/employees",   label: "Karyawan",    icon: UsersRound },
    { href: "/evaluations", label: "Evaluasi",    icon: ClipboardCheck },
    { href: "/promotions",  label: "Promosi",     icon: TrendingUp },
    { href: "/blockchain",  label: "Blockchain",  icon: Blocks },
    { href: "/audit-logs",  label: "Audit Log",   icon: ShieldCheck },
    { href: "/settings",    label: "Pengaturan",  icon: Settings },
  ],
  Manager: [
    { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
    { href: "/evaluations", label: "Evaluasi",    icon: ClipboardCheck },
    { href: "/promotions",  label: "Promosi",     icon: TrendingUp },
    { href: "/reports",     label: "Laporan",     icon: FileText },
  ],
  Director: [
    { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
    { href: "/promotions",  label: "Promosi",     icon: TrendingUp },
    { href: "/blockchain",  label: "Blockchain",  icon: Blocks },
    { href: "/reports",     label: "Laporan",     icon: FileText },
    { href: "/audit-logs",  label: "Audit Log",   icon: ShieldCheck },
    { href: "/settings",    label: "Pengaturan",  icon: Settings },
  ],
  Employee: [
    { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
    { href: "/evaluations", label: "Evaluasi Saya", icon: ClipboardCheck },
  ],
};

const roleColors: Record<string, string> = {
  HR:       "bg-violet-100 text-violet-700",
  Manager:  "bg-blue-100 text-blue-700",
  Director: "bg-amber-100 text-amber-700",
  Employee: "bg-emerald-100 text-emerald-700",
};

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [wallet, setWallet] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    // Load user profile from token
    api.get("/auth/profile")
      .then((r) => setUser(r.data.data))
      .catch(() => router.push("/login"));
  }, [router]);

  const nav = navByRole[user?.role ?? "Employee"] ?? navByRole.Employee;

  async function handleConnectWallet() {
    if (!isMetaMaskInstalled()) return alert("Install MetaMask terlebih dahulu!");
    try {
      const { address, chainId } = await connectWallet();
      if (chainId !== SEPOLIA_CHAIN_ID) await switchToSepolia();
      setWallet(address);
      setWalletConnected(true);
    } catch (e) {
      console.error(e);
    }
  }

  function handleLogout() {
    window.sessionStorage.removeItem("accessToken");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          <div>
            <span className="block text-sm font-bold text-slate-900">EPS Web3</span>
            <span className="block text-xs text-slate-400">Performance System</span>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[user.role] ?? "bg-slate-100 text-slate-600"}`}>
                  {user.role}
                </span>
              </div>
            </div>
            {user.walletAddress && (
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5">
                <Wallet className="h-3 w-3 text-indigo-400 shrink-0" />
                <span className="font-mono text-xs text-slate-500">{shortenAddress(user.walletAddress)}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-400">Hybrid DB + Blockchain Audit</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet button */}
            {user?.role !== "Employee" && (
              <button
                onClick={handleConnectWallet}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  walletConnected
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                <Wallet className="h-3.5 w-3.5" />
                {walletConnected ? shortenAddress(wallet) : "Connect MetaMask"}
              </button>
            )}

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  {user?.name.charAt(0) ?? "?"}
                </div>
                {user?.name ?? "Loading..."}
                <ChevronDown className="h-3 w-3" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
