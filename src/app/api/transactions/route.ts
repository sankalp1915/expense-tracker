import { NextRequest, NextResponse } from "next/server";
import { getDb, categorize, getMonthFromDate, CATEGORIES, Category } from "@/lib/db";

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

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "date must be in YYYY-MM-DD format" }, { status: 400 });
    }

    const month = getMonthFromDate(date);
    const resolvedCategory: Category =
      category && CATEGORIES.includes(category) ? category : categorize(merchant_name);

    const db = getDb();
    const stmt = db.prepare(
      "INSERT INTO transactions (amount, merchant_name, category, date, month, note) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const result = stmt.run(amount, merchant_name, resolvedCategory, date, month, note || "");

    return NextResponse.json(
      {
        success: true,
        transaction: {
          id: result.lastInsertRowid,
          amount,
          merchant_name,
          category: resolvedCategory,
          date,
          month,
          note: note || "",
        },
      },
      { status: 201 }
    );
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

    const db = getDb();
    const transactions = db
      .prepare("SELECT * FROM transactions WHERE month = ? ORDER BY date DESC, id DESC")
      .all(month);

    return NextResponse.json({ transactions });
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

    const db = getDb();
    db.prepare("DELETE FROM transactions WHERE id = ?").run(id);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
