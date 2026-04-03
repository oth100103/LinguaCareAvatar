import { NextResponse } from "next/server";

let config = {
  scenario: "job interview",
  level: "A2",
};

export async function GET() {
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const body = await req.json();
  config = body;
  return NextResponse.json({ status: "ok" });
}