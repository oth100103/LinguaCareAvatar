export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { AccessToken, type VideoGrant } from "livekit-server-sdk";

export async function POST(req: Request) {
  const apiKey = process.env.LIVEKIT_API_KEY?.trim();
  const apiSecret = process.env.LIVEKIT_API_SECRET?.trim();
  const livekitUrl = process.env.LIVEKIT_URL?.trim();

  if (!apiKey || !apiSecret || !livekitUrl) {
    return NextResponse.json(
      { error: "Missing LIVEKIT_API_KEY / LIVEKIT_API_SECRET / LIVEKIT_URL" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const roomName =
    body.room_name ||
    body.roomName ||
    `linguacare-${Date.now()}`;

  const identity =
    body.participant_identity ||
    body.participantIdentity ||
    `user-${Date.now()}`;

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    name: body.participant_name || "LinguaCare User",
    ttl: "10m",
    metadata: body.participant_metadata
      ? JSON.stringify(body.participant_metadata)
      : undefined,
    attributes: body.participant_attributes || undefined,
  });

  const grant: VideoGrant = {
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  };

  at.addGrant(grant);

  // Wichtig für Session APIs / Agent-Dispatch:
  // room_config vom Client direkt ins Token übernehmen
  if (body.room_config) {
    at.roomConfig = body.room_config;
  }

  const participantToken = await at.toJwt();

  return NextResponse.json(
    {
      server_url: livekitUrl,
      participant_token: participantToken,
    },
    { status: 201 }
  );
}