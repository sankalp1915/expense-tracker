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

function Icon({ name }: { name: string }) {
  const cls = "w-5 h-5 fill-white";
  switch (name) {
    case "Rent":
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      );
    case "Food":
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
        </svg>
      );
    case "Travel":
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      );
    case "Personal":
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
        </svg>
      );
    case "Medicine":
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        </svg>
      );
    case "Settlement":
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      );
    case "Not Necessary":
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
  }
}

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
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon name={item.category} />
                  </div>
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
