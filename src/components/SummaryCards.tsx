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
  totalCredits,
  balance,
}: {
  salary: number;
  totalExpenses: number;
  totalCredits: number;
  balance: number;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
      <div className="bg-card rounded-xl p-6 border border-card-border hover:border-card-hover transition-colors">
        <p className="text-muted text-base uppercase tracking-wider mb-2">Salary</p>
        <p className="text-3xl md:text-4xl font-bold text-green">{formatCurrency(salary)}</p>
      </div>
      <div className="bg-card rounded-xl p-6 border border-card-border hover:border-card-hover transition-colors">
        <p className="text-muted text-base uppercase tracking-wider mb-2">Credits</p>
        <p className="text-3xl md:text-4xl font-bold text-green">{formatCurrency(totalCredits)}</p>
      </div>
      <div className="bg-card rounded-xl p-6 border border-card-border hover:border-card-hover transition-colors">
        <p className="text-muted text-base uppercase tracking-wider mb-2">Expenses</p>
        <p className="text-3xl md:text-4xl font-bold text-accent">{formatCurrency(totalExpenses)}</p>
      </div>
      <div className="bg-card rounded-xl p-6 border border-card-border hover:border-card-hover transition-colors">
        <p className="text-muted text-base uppercase tracking-wider mb-2">Balance</p>
        <p className={`text-3xl md:text-4xl font-bold ${balance >= 0 ? "text-green" : "text-accent"}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}
