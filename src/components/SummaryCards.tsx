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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-card rounded-xl p-6 border border-card-border hover:border-card-hover transition-colors">
        <p className="text-muted text-lg uppercase tracking-wider mb-2">Salary</p>
        <p className="text-4xl md:text-5xl font-bold text-green">{formatCurrency(salary)}</p>
      </div>
      <div className="bg-card rounded-xl p-6 border border-card-border hover:border-card-hover transition-colors">
        <p className="text-muted text-lg uppercase tracking-wider mb-2">Total Expenses</p>
        <p className="text-4xl md:text-5xl font-bold text-accent">{formatCurrency(totalExpenses)}</p>
      </div>
      <div className="bg-card rounded-xl p-6 border border-card-border hover:border-card-hover transition-colors">
        <p className="text-muted text-lg uppercase tracking-wider mb-2">Balance Left</p>
        <p className={`text-4xl md:text-5xl font-bold ${balance >= 0 ? "text-green" : "text-accent"}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}
