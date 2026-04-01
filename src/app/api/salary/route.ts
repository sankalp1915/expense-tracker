import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/salary?month=YYYY-MM
export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month");
    if (!month) {
      return NextResponse.json({ error: "month query param required" }, { status: 400 });
    }

    const db = getDb();
    const row = db.prepare("SELECT * FROM salary WHERE month = ?").get(month) as {
      amount: number;
    } | undefined;

    return NextResponse.json({ salary: row?.amount ?? 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/salary  { month, amount }
export async function POST(req: NextRequest) {
  try {
    const { month, amount } = await req.json();

    if (!month || amount === undefined) {
      return NextResponse.json({ error: "month and amount required" }, { status: 400 });
    }

    const db = getDb();
    db.prepare(
      "INSERT INTO salary (month, amount) VALUES (?, ?) ON CONFLICT(month) DO UPDATE SET amount = excluded.amount"
    ).run(month, amount);

    return NextResponse.json({ success: true, month, amount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
