import { NextResponse } from "next/server";
import { Transaction } from "@mysten/sui/transactions";
import { getDemoKeypair, getSuiClient } from "@/lib/sui-server";
import { z } from "zod";

const Body = z.object({
  panelId: z.string().min(3).max(60),
  tokens: z.number().int().min(1).max(1_000),
  tokenPriceUsd: z.number().positive().max(10_000),
  estDailyDividendUsd: z.number().nonnegative().max(10_000),
  signedDigest: z.string().optional(),
  signerAddress: z.string().optional(),
});

const BUY_MIST = 100_000_000;

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid buy body", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { signedDigest, signerAddress, panelId, tokens, tokenPriceUsd, estDailyDividendUsd } = parsed.data;
  const position = { panelId, tokens, tokenPriceUsd, estDailyDividendUsd };

  if (signedDigest) {
    return NextResponse.json({
      ok: true,
      mode: "real",
      signer: "client",
      signerAddress: signerAddress ?? null,
      digest: signedDigest,
      position,
    });
  }

  const keypair = getDemoKeypair();
  if (!keypair) {
    return NextResponse.json({
      ok: true,
      mode: "dry-run",
      signer: "none",
      digest: null,
      position,
      note: "Connect a wallet, or set SUI_DEMO_PRIVATE_KEY for a real on-chain token mint.",
    });
  }

  try {
    const client = getSuiClient();
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [BUY_MIST]);
    tx.transferObjects([coin], keypair.toSuiAddress());
    tx.setSender(keypair.toSuiAddress());
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showEffects: true },
    });
    return NextResponse.json({
      ok: true,
      mode: "real",
      signer: "server-demo",
      signerAddress: keypair.toSuiAddress(),
      digest: result.digest,
      position,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as Error).message ?? e) }, { status: 500 });
  }
}
