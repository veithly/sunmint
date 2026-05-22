import { NextResponse } from "next/server";
import { Transaction } from "@mysten/sui/transactions";
import {
  CLOCK_OBJECT_ID,
  firstCreatedObjectId,
  getDemoKeypair,
  getMovePackageId,
  getSuiClient,
  stringToBytes,
} from "@/lib/sui-server";
import { z } from "zod";

const Body = z.object({
  panelId: z.string().min(3).max(60),
  tokens: z.number().int().min(1).max(1_000),
  tokenPriceUsd: z.number().positive().max(10_000),
  estDailyDividendUsd: z.number().nonnegative().max(10_000),
  signedDigest: z.string().optional(),
  signerAddress: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid buy body", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { signedDigest, signerAddress, panelId, tokens, tokenPriceUsd, estDailyDividendUsd } = parsed.data;
  const packageId = getMovePackageId();
  const position = { panelId, tokens, tokenPriceUsd, estDailyDividendUsd };

  if (!packageId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_MOVE_PACKAGE_ID is not configured" }, { status: 503 });
  }

  if (signedDigest) {
    return NextResponse.json({
      ok: true,
      mode: "real",
      chainMode: "move-call",
      signer: "client",
      signerAddress: signerAddress ?? null,
      packageId,
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
      packageId,
      digest: null,
      position,
      note: "Connect a wallet, or set SUI_DEMO_PRIVATE_KEY for a real on-chain token mint.",
    });
  }

  try {
    const client = getSuiClient();
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::panel::buy`,
      arguments: [
        tx.pure.vector("u8", stringToBytes(panelId)),
        tx.pure.u64(tokens),
        tx.pure.u64(Math.round(tokenPriceUsd * 100)),
        tx.pure.u64(Math.round(estDailyDividendUsd * 100)),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    tx.setSender(keypair.toSuiAddress());
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showEffects: true, showObjectChanges: true, showEvents: true },
    });
    return NextResponse.json({
      ok: true,
      mode: "real",
      chainMode: "move-call",
      signer: "server-demo",
      signerAddress: keypair.toSuiAddress(),
      packageId,
      objectId: firstCreatedObjectId(result, "::panel::PanelToken"),
      digest: result.digest,
      position,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as Error).message ?? e) }, { status: 500 });
  }
}
