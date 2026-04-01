import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "expenses.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initDb(db);
  }
  return db;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS salary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL UNIQUE,  -- format: YYYY-MM
      amount REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      merchant_name TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,          -- format: YYYY-MM-DD
      month TEXT NOT NULL,         -- format: YYYY-MM (derived from date)
      note TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL UNIQUE COLLATE NOCASE,
      category TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_month ON transactions(month);
    CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);
  `);

  // Seed default keywords if table is empty
  const count = db.prepare("SELECT COUNT(*) as c FROM keywords").get() as { c: number };
  if (count.c === 0) {
    const defaults: [string, string][] = [
      // Rent
      ["rent", "Rent"], ["landlord", "Rent"], ["housing", "Rent"], ["nobroker", "Rent"],

      // Food
      ["zomato", "Food"], ["swiggy", "Food"], ["dominos", "Food"], ["pizza", "Food"],
      ["restaurant", "Food"], ["cafe", "Food"], ["grocery", "Food"], ["bigbasket", "Food"],
      ["blinkit", "Food"], ["zepto", "Food"], ["dunzo", "Food"], ["mcdonald", "Food"],
      ["kfc", "Food"], ["burger", "Food"], ["instamart", "Food"], ["food", "Food"],

      // Travel
      ["uber", "Travel"], ["ola", "Travel"], ["rapido", "Travel"], ["irctc", "Travel"],
      ["railway", "Travel"], ["petrol", "Travel"], ["fuel", "Travel"], ["parking", "Travel"],
      ["metro", "Travel"], ["bus", "Travel"], ["flight", "Travel"], ["makemytrip", "Travel"],
      ["redbus", "Travel"],

      // Personal
      ["amazon", "Personal"], ["flipkart", "Personal"], ["myntra", "Personal"],
      ["ajio", "Personal"], ["shopping", "Personal"], ["netflix", "Personal"],
      ["spotify", "Personal"], ["hotstar", "Personal"], ["youtube", "Personal"],
      ["subscription", "Personal"],

      // Medicine
      ["pharmacy", "Medicine"], ["medical", "Medicine"], ["hospital", "Medicine"],
      ["doctor", "Medicine"], ["clinic", "Medicine"], ["apollo", "Medicine"],
      ["1mg", "Medicine"], ["pharmeasy", "Medicine"], ["netmeds", "Medicine"],
      ["medplus", "Medicine"], ["medicine", "Medicine"],

      // Settlement
      ["settlement", "Settlement"], ["split", "Settlement"], ["splitwise", "Settlement"],
      ["payback", "Settlement"], ["repay", "Settlement"], ["owe", "Settlement"],

      // Not Necessary
      ["gaming", "Not Necessary"], ["bet", "Not Necessary"], ["lottery", "Not Necessary"],
      ["casino", "Not Necessary"],
    ];

    const insert = db.prepare("INSERT OR IGNORE INTO keywords (keyword, category) VALUES (?, ?)");
    const tx = db.transaction(() => {
      for (const [kw, cat] of defaults) insert.run(kw, cat);
    });
    tx();
  }
}

export const CATEGORIES = [
  "Rent",
  "Food",
  "Travel",
  "Personal",
  "Medicine",
  "Settlement",
  "Not Necessary",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function categorize(merchantName: string): Category {
  const db = getDb();
  const keywords = db.prepare("SELECT keyword, category FROM keywords").all() as {
    keyword: string;
    category: Category;
  }[];

  const lower = merchantName.toLowerCase();
  for (const { keyword, category } of keywords) {
    if (lower.includes(keyword.toLowerCase())) return category;
  }
  return "Personal"; // default fallback
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthFromDate(dateStr: string): string {
  return dateStr.substring(0, 7); // YYYY-MM from YYYY-MM-DD
}
