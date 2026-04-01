import { NextRequest, NextResponse } from "next/server";
import { getDb, CATEGORIES } from "@/lib/db";

// GET /api/keywords
export async function GET() {
  try {
    const db = getDb();
    const keywords = db.prepare("SELECT * FROM keywords ORDER BY category, keyword").all();
    return NextResponse.json({ keywords });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/keywords  { keyword, category }
export async function POST(req: NextRequest) {
  try {
    const { keyword, category } = await req.json();

    if (!keyword || !category) {
      return NextResponse.json({ error: "keyword and category required" }, { status: 400 });
    }

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Invalid category. Must be one of: ${CATEGORIES.join(", ")}` }, { status: 400 });
    }

    const db = getDb();
    db.prepare("INSERT OR REPLACE INTO keywords (keyword, category) VALUES (?, ?)").run(keyword.toLowerCase(), category);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/keywords?id=123
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const db = getDb();
    db.prepare("DELETE FROM keywords WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
