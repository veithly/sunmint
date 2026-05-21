"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Wordmark } from "@/components/brand/logo";

type BuyResult = {
  ok: boolean;
  mode: "real" | "dry-run";
  signer: "client" | "server-demo" | "none";
  signerAddress: string | null;
  digest: string | null;
  position: {
    panelId: string;
    tokens: number;
    tokenPriceUsd: number;
    estDailyDividendUsd: number;
  };
  note?: string;
};

const PANELS = [
  {
    id: "jose-1200",
    issuer: "Jose · Guadalajara, MX",
    capKw: 1.2,
    tokenPrice: 6,
    estDailyPerToken: 0.011,
    soldOf: 1500,
    sold: 427,
    blurb: "Rooftop solar in Guadalajara. Sunny year-round, mature feed-in market.",
  },
  {
    id: "mei-2400",
    issuer: "Mei · Singapore",
    capKw: 2.4,
    tokenPrice: 8,
    estDailyPerToken: 0.013,
    soldOf: 3000,
    sold: 1212,
    blurb: "Apartment-block roof co-op in Singapore. High retail demand for climate yield.",
  },
  {
    id: "marina-3600",
    issuer: "Marina · Lisbon, PT",
    capKw: 3.6,
    tokenPrice: 7,
    estDailyPerToken: 0.012,
    soldOf: 4500,
    sold: 2304,
    blurb: "Installer-fronted lease in Lisbon. Tranched funding releases on commissioning.",
  },
];

export default function SunMintApp() {
  const [panel, setPanel] = useState(PANELS[0]);
  const [tokens, setTokens] = useState(10);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BuyResult | null>(null);

  const totalCost = useMemo(() => tokens * panel.tokenPrice, [tokens, panel]);
  const estDailyDividend = useMemo(() => tokens * panel.estDailyPerToken, [tokens, panel]);

  async function buy() {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/panels/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: panel.id,
          tokens,
          tokenPriceUsd: panel.tokenPrice,
          estDailyDividendUsd: estDailyDividend,
        }),
      });
      const json = (await res.json()) as BuyResult & { error?: string };
      if (!res.ok || json.error) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setResult(json);
    } catch (e) {
      setError(String((e as Error).message ?? e));
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#10120a] text-amber-50">
      <header className="border-b border-amber-400/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark className="h-8 text-amber-50" />
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-amber-200">
              testnet
            </span>
          </Link>
          <Link href="/" className="text-sm text-amber-100/80 hover:text-white">
            ← back
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Step 1 · Pick a panel</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Three live panels</h1>
          <p className="mt-3 max-w-prose text-sm text-amber-100/80">
            Each panel is a Sui object. Buying a token mints you a child object that earns USDC
            from the daily settle PTB. Pick a panel, choose a number of tokens, click buy.
          </p>

          <div className="mt-6 space-y-3">
            {PANELS.map((p) => {
              const active = p.id === panel.id;
              const progress = Math.round((p.sold / p.soldOf) * 100);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPanel(p);
                    setResult(null);
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-amber-300/70 bg-amber-300/10"
                      : "border-amber-400/10 bg-amber-400/[.03] hover:border-amber-300/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-50">{p.issuer}</span>
                    <span className="text-xs text-amber-200">{p.capKw} kW</span>
                  </div>
                  <div className="mt-1 text-xs text-amber-100/80">{p.blurb}</div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-amber-200/70">
                    <span>${p.tokenPrice}/token · est ${p.estDailyPerToken.toFixed(3)}/day</span>
                    <span>{progress}% sold</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-amber-400/15">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[.04] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Step 2 · Buy a slice</p>
          <h2 className="mt-3 text-2xl font-semibold">{panel.issuer}</h2>
          <p className="mt-1 text-sm text-amber-100/80">{panel.capKw} kW · ${panel.tokenPrice}/token</p>

          <label className="mt-5 block">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-300/80">
              Tokens · {tokens}
            </span>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={tokens}
              onChange={(e) => setTokens(Number(e.target.value))}
              className="mt-2 w-full accent-amber-400"
            />
          </label>

          <div className="mt-4 grid gap-2 rounded-xl border border-amber-400/15 bg-black/30 p-4 text-xs text-amber-100/80">
            <Row k="Total cost" v={`$${totalCost.toFixed(2)}`} />
            <Row k="Est. daily dividend" v={`$${estDailyDividend.toFixed(3)}`} />
            <Row k="Settle PTB" v="Daily, automatic" />
            <Row k="Receipt" v="On-chain Token object" />
          </div>

          <button
            onClick={buy}
            disabled={running}
            className="mt-6 w-full rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-70"
          >
            {running ? "Buying on Sui Testnet…" : `Buy ${tokens} token${tokens > 1 ? "s" : ""} for $${totalCost.toFixed(2)}`}
          </button>

          {error && (
            <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-4 space-y-3 rounded-xl border border-emerald-300/30 bg-emerald-300/5 p-4 text-xs">
              <div className="flex items-center justify-between text-emerald-200">
                <span className="text-[11px] uppercase tracking-[0.25em]">Token minted</span>
                <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-0.5 text-[10px] text-emerald-100">
                  {result.mode === "real" ? `Real PTB · ${result.signer}` : "Dry-run"}
                </span>
              </div>
              {result.digest ? (
                <a
                  href={`https://testnet.suivision.xyz/txblock/${result.digest}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-[11px] text-emerald-100 underline-offset-4 hover:underline"
                >
                  {result.digest}
                </a>
              ) : (
                <p className="text-emerald-200/80">{result.note}</p>
              )}
              <div className="text-[11px] text-emerald-100/80">
                +{result.position.tokens} tokens · est ${result.position.estDailyDividendUsd.toFixed(3)}/day USDC
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[.04] p-6 text-sm text-amber-100/80">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Coverage</p>
          <p className="mt-3">
            For Sui Overflow we ship the on-chain flow against Sui Testnet using the trial wallet.
            Production v2 swaps the JSON inverter feed for a real DePIN attestation (Helium-on-Sui /
            IoTeX / Solana DePIN bridges). Reviewers can connect their own wallet via Mysten dApp
            Kit and buy slices from their address with the same UX.
          </p>
        </div>
      </section>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-amber-400/10 pb-2 last:border-none last:pb-0">
      <span className="text-amber-300/80">{k}</span>
      <span className="text-right font-medium text-amber-50">{v}</span>
    </div>
  );
}
