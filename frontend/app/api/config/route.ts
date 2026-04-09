import { NextResponse } from "next/server";

let config = {
  scenario: "job interview",
  level: "A2",
  tone: "neutral",
};

export async function GET() {
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const body = await req.json();

  config = {
    scenario: body.scenario || config.scenario,
    level: body.level || config.level,
    tone: body.tone || config.tone,
  };

  console.log("UPDATED CONFIG:", config);

  return NextResponse.json({ status: "ok", config });
}