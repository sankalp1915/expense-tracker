"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  Rent: "#6366f1",
  Food: "#f59e0b",
  Travel: "#3b82f6",
  Personal: "#8b5cf6",
  Medicine: "#ef4444",
  Settlement: "#14b8a6",
  "Not Necessary": "#f97316",
};

interface Props {
  breakdown: { category: string; total: number }[];
}

export default function CategoryChart({ breakdown }: Props) {
  const data = breakdown.filter((b) => b.total > 0);

  if (data.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-center min-h-[300px]">
        <p className="text-muted">No expenses yet this month</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.category} fill={COLORS[entry.category] || "#666"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              color: "#eee",
            }}
            formatter={(value) =>
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(Number(value))
            }
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => <span className="text-xs text-muted">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
