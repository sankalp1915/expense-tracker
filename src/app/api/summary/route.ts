import { NextRequest, NextResponse } from "next/server";
import { getDb, CATEGORIES } from "@/lib/db";

// GET /api/summary?month=YYYY-MM
export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month");
    if (!month) {
      return NextResponse.json({ error: "month query param required" }, { status: 400 });
    }

    const db = getDb();

    const salaryRow = db.prepare("SELECT amount FROM salary WHERE month = ?").get(month) as {
      amount: number;
    } | undefined;
    const salary = salaryRow?.amount ?? 0;

    const totalRow = db
      .prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE month = ?")
      .get(month) as { total: number };
    const totalExpenses = totalRow.total;

    const categoryBreakdown = db
      .prepare(
        "SELECT category, COALESCE(SUM(amount), 0) as total FROM transactions WHERE month = ? GROUP BY category ORDER BY total DESC"
      )
      .all(month) as { category: string; total: number }[];

    // Ensure all categories present
    const catMap = new Map(categoryBreakdown.map((c) => [c.category, c.total]));
    const fullBreakdown = CATEGORIES.map((cat) => ({
      category: cat,
      total: catMap.get(cat) ?? 0,
    }));

    // Available months for history navigation
    const months = db
      .prepare(
        "SELECT DISTINCT month FROM (SELECT month FROM transactions UNION SELECT month FROM salary) ORDER BY month DESC"
      )
      .all() as { month: string }[];

    return NextResponse.json({
      month,
      salary,
      totalExpenses,
      balance: salary - totalExpenses,
      categoryBreakdown: fullBreakdown,
      availableMonths: months.map((m) => m.month),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
