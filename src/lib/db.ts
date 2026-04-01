import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export async function categorize(merchantName: string): Promise<Category> {
  const { data: keywords } = await supabase
    .from("keywords")
    .select("keyword, category");

  if (keywords) {
    const lower = merchantName.toLowerCase();
    for (const { keyword, category } of keywords) {
      if (lower.includes(keyword.toLowerCase())) return category as Category;
    }
  }
  return "Personal";
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthFromDate(dateStr: string): string {
  return dateStr.substring(0, 7);
}
