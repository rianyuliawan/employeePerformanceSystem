"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  LockKeyhole,
  Mail,
  Wallet,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Link2,
  FileCheck2,
} from "lucide-react";
import { api } from "@/lib/api";
import { connectWallet, switchToSepolia, signMessage, isMetaMaskInstalled, shortenAddress, SEPOLIA_CHAIN_ID } from "@/lib/wallet";

type LoginMode = "email" | "wallet";

export default function LoginPage() {
  const router = useRouter();

  // Shared state
  const [mode, setMode] = useState<LoginMode>("wallet");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Wallet login state
  const [walletAddress, setWalletAddress] = useState("");
  const [walletStep, setWalletStep] = useState<"idle" | "connected" | "signing" | "done">("idle");
  const [chainId, setChainId] = useState("");
  const [walletRegistered, setWalletRegistered] = useState<boolean | null>(null);

  // ── Email login ──────────────────────────────────────────────────
  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      window.sessionStorage.setItem("accessToken", response.data.data.accessToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        setError("Tidak bisa terhubung ke server. Pastikan backend sedang berjalan.");
      } else {
        setError("Email atau password tidak valid.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Wallet login ─────────────────────────────────────────────────
  async function handleConnectWallet() {
    setError("");
    setLoading(true);
    try {
      if (!isMetaMaskInstalled()) {
        throw new Error("MetaMask belum terpasang. Install MetaMask terlebih dahulu.");
      }

      // Connect & switch network
      const { address, chainId: cid } = await connectWallet();
      if (cid !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia();
      }
      setWalletAddress(address);
      setChainId(SEPOLIA_CHAIN_ID);

      // Check if wallet is registered in our system
      try {
        const check = await api.get(`/auth/wallet-check?address=${address}`);
        setWalletRegistered(check.data.data.isRegistered);
      } catch {
        setWalletRegistered(false);
      }

      setWalletStep("connected");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal connect wallet.");
    } finally {
      setLoading(false);
    }
  }

  async function handleWalletLogin() {
    setError("");
    setLoading(true);
    try {
      setWalletStep("signing");

      // 1. Get nonce from backend
      const nonceRes = await api.get(`/auth/nonce?address=${walletAddress}`);
      const { nonce } = nonceRes.data.data;

      // 2. Sign nonce with MetaMask
      const signature = await signMessage(nonce);

      // 3. Send to backend for verification
      const loginRes = await api.post("/auth/wallet-login", {
        address: walletAddress,
        signature,
      });

      setWalletStep("done");
      window.sessionStorage.setItem("accessToken", loginRes.data.data.accessToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      setWalletStep("connected");
      if (err instanceof Error && err.message.includes("Wallet address not registered")) {
        setError("Wallet belum terdaftar. Hubungi admin untuk mendaftarkan wallet address ini.");
      } else {
        setError(err instanceof Error ? err.message : "Gagal login dengan wallet.");
      }
    } finally {
      setLoading(false);
    }
  }

  const isOnSepolia = chainId === SEPOLIA_CHAIN_ID;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
        {/* ── Branding panel (desktop only) ─────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-10 relative">
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2.5 mb-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold tracking-tight">Employee Performance System</span>
            </div>

            <h2 className="text-3xl font-bold text-white leading-tight mb-4">
              Penilaian kinerja yang <span className="text-indigo-400">transparan</span> &amp; tidak bisa dimanipulasi
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Setiap evaluasi, kenaikan pangkat, dan dokumen resmi diamankan dengan kriptografi dan tercatat
              di blockchain — jejaknya permanen dan bisa diverifikasi siapa saja.
            </p>
          </div>

          <div className="relative space-y-5 mt-10">
            <FeatureItem
              icon={ShieldCheck}
              title="Enkripsi AES-256-GCM"
              desc="Data pribadi karyawan tidak pernah tersimpan dalam bentuk terbuka."
            />
            <FeatureItem
              icon={Link2}
              title="Tercatat di Blockchain Sepolia"
              desc="Setiap keputusan penilaian & promosi tidak bisa diubah diam-diam."
            />
            <FeatureItem
              icon={FileCheck2}
              title="Surat Keputusan Digital"
              desc="Dokumen resmi dengan hash yang bisa diverifikasi kapan saja."
            />
          </div>

          <a
            href="https://sepolia.etherscan.io/address/0x4318928514534c6f2C7a7e9262d82F4569c1E7Af"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-400 transition-colors mt-10 font-mono"
          >
            <ExternalLink className="w-3 h-3" />
            0x4318...E7Af on Sepolia Testnet
          </a>
        </div>

        {/* ── Login card ───────────────────────────────────────── */}
        <div className="bg-white/[0.04] backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-center">
          {/* Header (compact, always visible) */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 mb-4">
              <Wallet className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Employee Performance System</h1>
            <p className="text-slate-400 text-sm mt-1">Blockchain-powered evaluation platform</p>
          </div>
          <div className="hidden lg:block mb-8">
            <h1 className="text-xl font-bold text-white">Masuk ke akun Anda</h1>
            <p className="text-slate-400 text-sm mt-1">Pilih metode login di bawah ini.</p>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("wallet"); setError(""); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === "wallet"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wallet className="w-4 h-4" />
              MetaMask
            </button>
            <button
              onClick={() => { setMode("email"); setError(""); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === "email"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          {/* ── WALLET LOGIN ─────────────────────────────────── */}
          {mode === "wallet" && (
            <div className="space-y-4">
              {/* Step indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <StepDot active={walletStep === "idle"} done={walletStep !== "idle"} n={1} label="Connect" />
                <div className="flex-1 h-px bg-white/10" />
                <StepDot active={walletStep === "connected"} done={walletStep === "signing" || walletStep === "done"} n={2} label="Sign" />
                <div className="flex-1 h-px bg-white/10" />
                <StepDot active={walletStep === "done"} done={false} n={3} label="Enter" />
              </div>

              {/* Connected info */}
              {walletAddress && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Connected wallet</p>
                      <p className="text-sm font-mono text-white font-medium">{shortenAddress(walletAddress)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isOnSepolia ? "bg-green-400" : "bg-yellow-400"}`} />
                      <span className="text-xs text-slate-400">{isOnSepolia ? "Sepolia" : "Wrong Network"}</span>
                    </div>
                  </div>
                  {/* Registration status */}
                  {walletRegistered !== null && (
                    <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      walletRegistered
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                    }`}>
                      <span>{walletRegistered ? "✓" : "!"}</span>
                      <span>
                        {walletRegistered
                          ? "Wallet terdaftar di sistem — siap login"
                          : "Wallet belum terdaftar — hubungi admin"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Etherscan link */}
              {walletAddress && (
                <a
                  href={`https://sepolia.etherscan.io/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Lihat di Sepolia Etherscan
                </a>
              )}

              {/* Connect button */}
              {walletStep === "idle" && (
                <button
                  onClick={handleConnectWallet}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                  {loading ? "Menghubungkan..." : "Connect MetaMask"}
                </button>
              )}

              {/* Sign & Login button */}
              {walletStep === "connected" && (
                <button
                  onClick={handleWalletLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {loading ? "Menandatangani..." : "Sign & Login"}
                </button>
              )}

              {walletStep === "connected" && (
                <button
                  onClick={() => { setWalletAddress(""); setChainId(""); setWalletStep("idle"); setError(""); }}
                  className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Ganti wallet
                </button>
              )}

              <p className="text-xs text-slate-500 text-center">
                Login menggunakan tanda tangan kriptografi ECDSA.{" "}
                <span className="text-indigo-400">Private key tidak pernah meninggalkan MetaMask.</span>
              </p>
            </div>
          )}

          {/* ── EMAIL LOGIN ──────────────────────────────────── */}
          {mode === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-11 focus-within:border-indigo-500/60 transition-colors">
                  <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                  <input
                    className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@company.com"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-11 focus-within:border-indigo-500/60 transition-colors">
                  <LockKeyhole className="h-4 w-4 text-slate-500 shrink-0" />
                  <input
                    className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-indigo-500/25"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LockKeyhole className="w-4 h-4" />}
                {loading ? "Masuk..." : "Login"}
              </button>
              <p className="text-xs text-slate-500 text-center">
                Lupa kredensial akun? Hubungi tim HR perusahaan Anda.
              </p>
            </form>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Footer (mobile only — desktop has it in the branding panel) */}
          <p className="text-center text-xs text-slate-600 mt-6 lg:hidden">
            Contract:{" "}
            <a
              href="https://sepolia.etherscan.io/address/0x4318928514534c6f2C7a7e9262d82F4569c1E7Af"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-400 font-mono"
            >
              0x4318...E7Af
            </a>{" "}
            on Sepolia
          </p>
        </div>
      </div>
    </main>
  );
}

// ── Helper components ──────────────────────────────────────────────
function StepDot({ active, done, n, label }: { active: boolean; done: boolean; n: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          done
            ? "bg-green-500 text-white"
            : active
            ? "bg-indigo-600 text-white ring-2 ring-indigo-400/30"
            : "bg-white/10 text-slate-500"
        }`}
      >
        {done ? "✓" : n}
      </div>
      <span className={`text-[10px] ${active ? "text-indigo-400" : done ? "text-green-400" : "text-slate-600"}`}>
        {label}
      </span>
    </div>
  );
}

function FeatureItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
