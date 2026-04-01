"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  Rent: "#6366f1",
  Food: "#f59e0b",
  Travel: "#3b82f6",
  Personal: "#8b5cf6",
  Medicine: "#e50914",
  Settlement: "#14b8a6",
  "Not Necessary": "#f97316",
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

export default function CategoryChart({ breakdown, totalExpenses }: Props) {
  const data = breakdown.filter((b) => b.total > 0);

  if (data.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-xl p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-muted text-xl">No expenses yet this month</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-xl p-6">
      <h3 className="text-xl font-bold text-foreground uppercase tracking-wider mb-4">Spending Breakdown</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={3}
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={COLORS[entry.category] || "#666"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1f1f1f",
                border: "1px solid #444",
                borderRadius: "10px",
                color: "#e5e5e5",
                fontSize: "18px",
                padding: "12px 16px",
              }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-muted text-sm uppercase tracking-wider">Total</span>
          <span className="text-3xl font-bold text-accent">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((entry) => (
          <div key={entry.category} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[entry.category] || "#666" }}
            />
            <span className="text-sm text-muted">{entry.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
