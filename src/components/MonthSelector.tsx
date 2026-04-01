"use client";

function formatMonthLabel(m: string) {
  const [year, month] = m.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function MonthSelector({
  month,
  onChange,
  availableMonths,
}: {
  month: string;
  onChange: (m: string) => void;
  availableMonths: string[];
}) {
  const current = getCurrentMonth();
  const allMonths = Array.from(new Set([current, month, ...availableMonths])).sort().reverse();

  return (
    <div className="flex items-center gap-3">
      <select
        value={month}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border border-card-border rounded-md px-5 py-3 text-base text-foreground focus:outline-none focus:border-accent cursor-pointer transition-colors"
      >
        {allMonths.map((m) => (
          <option key={m} value={m}>
            {formatMonthLabel(m)}
          </option>
        ))}
      </select>
      {month !== current && (
        <button
          onClick={() => onChange(current)}
          className="text-sm text-accent hover:text-accent-light font-bold uppercase tracking-wider transition-colors"
        >
          Current month
        </button>
      )}
    </div>
  );
}
