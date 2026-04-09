export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { AgentDispatchClient } from "livekit-server-sdk";

export async function POST() {
  const host = process.env.LIVEKIT_URL?.trim();
  const apiKey = process.env.LIVEKIT_API_KEY?.trim();
  const apiSecret = process.env.LIVEKIT_API_SECRET?.trim();

  if (!host || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Missing LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET" },
      { status: 500 }
    );
  }

  const roomName = "linguacare-room";
  const agentName = "default";

  const dispatchClient = new AgentDispatchClient(host, apiKey, apiSecret);
  const dispatch = await dispatchClient.createDispatch(roomName, agentName);

  return NextResponse.json({ ok: true, dispatch });
}