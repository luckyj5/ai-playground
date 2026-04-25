import { NextResponse } from "next/server";
import { addSubscriber, isValidEmail } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
  const b = body as { email?: unknown; source?: unknown };
  if (!isValidEmail(String(b.email ?? ""))) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 400 },
    );
  }
  const source =
    typeof b.source === "string" && b.source.length > 0
      ? b.source.slice(0, 64)
      : "waitlist";
  try {
    const { alreadyExisted, count } = await addSubscriber(
      String(b.email),
      source,
    );
    return NextResponse.json({ ok: true, alreadyExisted, count });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[scentsense] subscribe failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your email. Try again later." },
      { status: 500 },
    );
  }
}
