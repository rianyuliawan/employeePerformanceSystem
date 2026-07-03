import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

export default function BlockchainPage() {
  return (
    <AppShell title="Blockchain">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Smart Contract Audit Layer</h2>
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          <div><dt className="text-sm text-slate-500">Network</dt><dd className="font-medium">Ethereum Sepolia</dd></div>
          <div><dt className="text-sm text-slate-500">Contract Address</dt><dd className="font-mono text-sm">{process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "Not configured"}</dd></div>
          <div><dt className="text-sm text-slate-500">On-chain Data</dt><dd className="font-medium">Document hash, status, wallet, timestamp</dd></div>
          <div><dt className="text-sm text-slate-500">Sensitive Data</dt><dd className="font-medium">Stored encrypted in PostgreSQL only</dd></div>
        </dl>
        <div className="mt-5"><Button variant="outline">Retry Pending Sync</Button></div>
      </section>
    </AppShell>
  );
}

