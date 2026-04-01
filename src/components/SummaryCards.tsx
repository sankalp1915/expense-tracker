"use client";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SummaryCards({
  salary,
  totalExpenses,
  balance,
}: {
  salary: number;
  totalExpenses: number;
  balance: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card border border-card-border rounded-xl p-5">
        <p className="text-muted text-sm mb-1">Salary</p>
        <p className="text-2xl font-bold text-accent-light">{formatCurrency(salary)}</p>
      </div>
      <div className="bg-card border border-card-border rounded-xl p-5">
        <p className="text-muted text-sm mb-1">Total Expenses</p>
        <p className="text-2xl font-bold text-red">{formatCurrency(totalExpenses)}</p>
      </div>
      <div className="bg-card border border-card-border rounded-xl p-5">
        <p className="text-muted text-sm mb-1">Balance Left</p>
        <p className={`text-2xl font-bold ${balance >= 0 ? "text-green" : "text-red"}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}
