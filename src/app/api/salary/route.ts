import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

// GET /api/salary?month=YYYY-MM
export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month");
    if (!month) {
      return NextResponse.json({ error: "month query param required" }, { status: 400 });
    }

    const { data } = await supabase
      .from("salary")
      .select("amount")
      .eq("month", month)
      .single();

    return NextResponse.json({ salary: data?.amount ?? 0 });
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

    const { error } = await supabase
      .from("salary")
      .upsert({ month, amount }, { onConflict: "month" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, month, amount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
