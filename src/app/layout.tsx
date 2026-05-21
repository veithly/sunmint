import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://suioverflow-sunmint.veithly.workers.dev"),
  title: "SunMint — Own a roof you've never seen",
  description:
    "SunMint tokenizes a solar feed-in tariff on Sui. Buy tokens, earn USDC dividends from real kWh produced. Climate yield without emissions inflation.",
  openGraph: {
    title: "SunMint — Own a roof you've never seen",
    description:
      "Sui-native solar RWA. Daily USDC dividends from real kWh produced. Panels as Sui objects, tokens as typed children.",
    images: ["/opengraph-image.png"],
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
