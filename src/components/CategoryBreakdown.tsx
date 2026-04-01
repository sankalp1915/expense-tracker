"use client";

const COLORS: Record<string, string> = {
  Rent: "#6366f1",
  Food: "#f59e0b",
  Travel: "#3b82f6",
  Personal: "#8b5cf6",
  Medicine: "#e50914",
  Settlement: "#14b8a6",
  "Not Necessary": "#f97316",
};

const ICONS: Record<string, string> = {
  Rent: "🏠",
  Food: "🍔",
  Travel: "✈️",
  Personal: "🛍️",
  Medicine: "💊",
  Settlement: "🤝",
  "Not Necessary": "⚡",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  breakdown: { category: string; total: number }[];
  totalExpenses: number;
}

export default function CategoryBreakdown({ breakdown, totalExpenses }: Props) {
  const sorted = [...breakdown].sort((a, b) => b.total - a.total);

  return (
    <div className="bg-card border border-card-border rounded-xl p-6">
      <h3 className="text-xl font-bold text-foreground uppercase tracking-wider mb-6">
        Category Wise Expense
      </h3>
      <div className="space-y-5">
        {sorted.map((item) => {
          const percent = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
          const color = COLORS[item.category] || "#666";

          return (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ICONS[item.category] || "📦"}</span>
                  <span className="text-lg font-medium">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold" style={{ color }}>
                    {formatCurrency(item.total)}
                  </span>
                  <span className="text-sm text-muted w-14 text-right">
                    {percent > 0 ? `${percent.toFixed(1)}%` : "—"}
                  </span>
                </div>
              </div>
              <div className="w-full h-3 bg-[#0a0a0a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(percent, percent > 0 ? 2 : 0)}%`,
                    backgroundColor: color,
                    boxShadow: percent > 0 ? `0 0 12px ${color}60` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
