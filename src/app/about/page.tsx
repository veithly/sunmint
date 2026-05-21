import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-[#10120a] text-amber-50">
      <header className="border-b border-amber-400/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark className="h-8 text-amber-50" />
          </Link>
          <Link href="/app" className="text-sm text-amber-100/80 hover:text-white">
            Buy a panel slice →
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300/80">Architecture &amp; rationale</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">SunMint in 60 seconds.</h1>
        <p className="mt-3 max-w-2xl text-base text-amber-100/80">
          Three Sui objects model the rooftop: a Panel owned by the homeowner, Tokens minted to
          investors, and a DividendPool that fills with USDC at every settle. A keeper calls
          <code className="ml-1 rounded bg-amber-400/15 px-1 text-amber-100">settle_day(panel_id)</code> per
          panel per day, paying USDC dividends proportional to each token holder&apos;s share.
        </p>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">Move package</h2>
        <pre className="mt-3 overflow-x-auto rounded-2xl border border-amber-400/15 bg-black/40 p-5 text-xs leading-relaxed text-amber-50">
{`module sunmint::panel {
    struct Panel has key {
        id: UID,
        issuer: address,
        kw_capacity: u64,
        location: vector<u8>,
        total_tokens: u64,
        sold_tokens: u64,
        total_kwh_recorded: u64,
        last_dividend_ts: u64,
        dividend_pool: Coin<USDC>,
    }

    struct PanelToken has key { id: UID, panel_id: ID, tokens: u64 }

    public entry fun buy_tokens(p: &mut Panel, tokens: u64, pay: Coin<USDC>, ctx: &mut TxContext) { /* ... */ }
    public entry fun settle_day(p: &mut Panel, kwh_today: u64, price_per_kwh: u64, oracle: &Oracle, ctx: &mut TxContext) { /* ... */ }
}`}
        </pre>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">Oracle path</h2>
        <p className="mt-3 max-w-2xl text-base text-amber-100/80">
          For the MVP the oracle is a curated JSON endpoint posting daily kWh per panel. Production
          v2 reads from a DePIN attestation source (Helium-on-Sui, IoTeX, or a Solana DePIN bridge),
          and the Move function gates the settle on a multi-sig oracle signature.
        </p>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">Why on Sui</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-amber-100/80">
          <li>Panels are objects — every dividend, every kWh recorded, every transfer is on-chain and queryable.</li>
          <li>The dividend PTB is one transaction per panel per day — daily settle scales linearly with the network.</li>
          <li>USDC + Sui finality gives investors real-time visibility into their yield, not monthly statements.</li>
          <li>Switchable signer: connect your own wallet via Mysten dApp Kit, or use the hosted trial wallet for review.</li>
        </ul>
      </section>

      <footer className="border-t border-amber-400/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-amber-100/60">
          <span>Built for Sui Overflow 2026 · Explorations track</span>
          <Link href="/app" className="text-amber-100 hover:text-white">
            Try the demo →
          </Link>
        </div>
      </footer>
    </main>
  );
}
