import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";

export default function Home() {
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
          <div className="flex items-center gap-5 text-sm text-amber-100/80">
            <Link href="/about" className="hover:text-white">
              How it works
            </Link>
            <Link
              href="/app"
              className="rounded-full bg-amber-400 px-4 py-1.5 font-semibold text-stone-900 hover:bg-amber-300"
            >
              Buy a panel slice
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
            Explorations track · Sui Overflow 2026
          </p>
          <h1 className="mt-4 text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Own a roof you&apos;ve never seen.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-amber-100/80">
            SunMint tokenizes a solar feed-in tariff. Homeowners issue token-rights to the future
            kWh from their roof; investors anywhere buy a slice. Every day the panel produces, a
            Sui PTB pays USDC dividends back to token holders in proportion to their share.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-300"
            >
              Buy a slice →
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-amber-400/30 px-6 py-3 text-sm text-amber-100 hover:border-amber-300/60"
            >
              How it works
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 text-sm">
            <Stat label="Panel objects on Sui" value="∞" />
            <Stat label="Yield source" value="kWh" />
            <Stat label="Settle cadence" value="Daily" />
          </dl>
        </div>

        <aside className="relative rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-300/5 to-emerald-300/5 p-6 shadow-[0_8px_60px_-20px_rgba(245,158,11,0.45)] backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300">Live panel</p>
          <h2 className="mt-2 text-xl font-semibold">Jose · Guadalajara · 1.2 kW</h2>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-amber-400/20 bg-stone-950/40 p-4 text-xs">
            <Pill label="now" value="0.96 kW" tone="amber" />
            <Pill label="today" value="6.4 kWh" tone="amber" />
            <Pill label="month" value="172 kWh" tone="green" />
            <Pill label="div" value="$0.27" tone="green" />
          </div>
          <div className="mt-5 grid gap-2 text-xs text-amber-100/80">
            <Row k="Token price" v="$6.00" />
            <Row k="Tokens sold" v="427 / 1,500" />
            <Row k="Avg daily dividend" v="$0.011 / token" />
            <Row k="Underlying" v="USDC on Sui" />
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h3 className="text-2xl font-semibold tracking-tight">Why on Sui.</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card kicker="01" title="Panel as object" body="The panel is a typed Sui object. Tokens are typed children. Anyone can audit total kWh produced, dividend history, and token ownership without a corporate portal." />
          <Card kicker="02" title="Real-world yield" body="Dividends come from real kWh produced — not from emissions, not from token inflation. Climate investors get a yield curve tied to the sun." />
          <Card kicker="03" title="Sui Clock settle" body="One PTB per day per panel. The keeper calls settle_day(panel_id); the function pays USDC dividends proportionally and updates the panel&apos;s state." />
        </div>
      </section>

      <footer className="border-t border-amber-400/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-amber-100/60">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark className="h-6 text-amber-100/80" />
          </Link>
          <span>Built for Sui Overflow 2026 · Explorations track</span>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.25em] text-amber-300/80">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-amber-50">{value}</dd>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-amber-400/10 pb-2 last:border-none">
      <span className="text-amber-300/80">{k}</span>
      <span className="font-medium text-amber-50">{v}</span>
    </div>
  );
}

function Pill({ label, value, tone }: { label: string; value: string; tone: "amber" | "green" }) {
  const color = tone === "amber" ? "text-amber-100" : "text-emerald-200";
  return (
    <div className="rounded-xl bg-stone-900/60 p-2 text-center">
      <div className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70">{label}</div>
      <div className={`mt-1 text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

function Card({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[.04] p-5">
      <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-300/80">{kicker}</p>
      <h4 className="mt-2 text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-amber-100/80">{body}</p>
    </div>
  );
}
