"use client";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  salary: number;
  totalExpenses: number;
  balance: number;
}

export default function SpendingRing({ salary, totalExpenses, balance }: Props) {
  const percent = salary > 0 ? Math.min((totalExpenses / salary) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const getColor = () => {
    if (percent < 50) return "#46d369";
    if (percent < 80) return "#f5c518";
    return "#e50914";
  };

  return (
    <div className="bg-card border border-card-border rounded-xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-foreground uppercase tracking-wider mb-6 self-start">
        Budget Usage
      </h3>
      <div className="relative w-[220px] h-[220px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="14"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={getColor()}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${getColor()}60)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: getColor() }}>
            {percent.toFixed(0)}%
          </span>
          <span className="text-sm text-muted uppercase tracking-wider">Spent</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 w-full text-center">
        <div>
          <p className="text-sm text-muted uppercase tracking-wider">Income</p>
          <p className="text-lg font-bold text-green">{formatCurrency(salary)}</p>
        </div>
        <div>
          <p className="text-sm text-muted uppercase tracking-wider">Spent</p>
          <p className="text-lg font-bold text-accent">{formatCurrency(totalExpenses)}</p>
        </div>
        <div>
          <p className="text-sm text-muted uppercase tracking-wider">Left</p>
          <p className={`text-lg font-bold ${balance >= 0 ? "text-green" : "text-accent"}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
    </div>
  );
}
