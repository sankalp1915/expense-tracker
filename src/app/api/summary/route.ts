import { NextRequest, NextResponse } from "next/server";
import { supabase, CATEGORIES } from "@/lib/db";

// GET /api/summary?month=YYYY-MM
export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month");
    if (!month) {
      return NextResponse.json({ error: "month query param required" }, { status: 400 });
    }

    // Get salary
    const { data: salaryRow } = await supabase
      .from("salary")
      .select("amount")
      .eq("month", month)
      .single();
    const salary = salaryRow?.amount ?? 0;

    // Get all transactions for this month
    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount, category")
      .eq("month", month);

    const totalExpenses = (transactions || []).reduce((sum, t) => sum + Number(t.amount), 0);

    // Build category breakdown
    const catMap = new Map<string, number>();
    for (const t of transactions || []) {
      catMap.set(t.category, (catMap.get(t.category) || 0) + Number(t.amount));
    }
    const categoryBreakdown = CATEGORIES.map((cat) => ({
      category: cat,
      total: catMap.get(cat) ?? 0,
    }));

    // Get available months
    const { data: txMonths } = await supabase
      .from("transactions")
      .select("month")
      .order("month", { ascending: false });

    const { data: salMonths } = await supabase
      .from("salary")
      .select("month")
      .order("month", { ascending: false });

    const allMonths = new Set<string>();
    for (const r of txMonths || []) allMonths.add(r.month);
    for (const r of salMonths || []) allMonths.add(r.month);
    const availableMonths = Array.from(allMonths).sort().reverse();

    return NextResponse.json({
      month,
      salary,
      totalExpenses,
      balance: salary - totalExpenses,
      categoryBreakdown,
      availableMonths,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
