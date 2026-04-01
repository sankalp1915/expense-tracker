import { NextRequest, NextResponse } from "next/server";
import { supabase, categorize, getMonthFromDate, CATEGORIES, Category } from "@/lib/db";

// POST /api/transactions — the Tasker / automation endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, merchant_name, date, category, note } = body;

    if (!amount || !merchant_name || !date) {
      return NextResponse.json(
        { error: "Missing required fields: amount, merchant_name, date" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "date must be in YYYY-MM-DD format" }, { status: 400 });
    }

    const month = getMonthFromDate(date);
    const resolvedCategory: Category =
      category && CATEGORIES.includes(category) ? category : await categorize(merchant_name);

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        amount,
        merchant_name,
        category: resolvedCategory,
        date,
        month,
        note: note || "",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, transaction: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/transactions?month=YYYY-MM
export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month");
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "month query param required (YYYY-MM)" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("month", month)
      .order("date", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/transactions?id=123
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id query param required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
