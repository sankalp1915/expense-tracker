"use client";

interface Transaction {
  id: number;
  amount: number;
  merchant_name: string;
  category: string;
  date: string;
  note: string;
  type: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Rent: "bg-indigo-500/20 text-indigo-300",
  Food: "bg-amber-500/20 text-amber-300",
  Travel: "bg-blue-500/20 text-blue-300",
  Personal: "bg-violet-500/20 text-violet-300",
  Medicine: "bg-red-500/20 text-red-300",
  Settlement: "bg-teal-500/20 text-teal-300",
  "Not Necessary": "bg-orange-500/20 text-orange-300",
};

export default function TransactionTable({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-xl p-10 text-center text-muted text-lg">
        No transactions this month
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-card-border">
        <h3 className="text-xl font-bold text-foreground uppercase tracking-wider">
          Transactions <span className="text-muted">({transactions.length})</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-lg">
          <thead>
            <tr className="border-b border-card-border text-muted text-left">
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-sm">Date</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-sm">Merchant</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-sm">Category</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-sm text-right">Amount</th>
              <th className="px-5 py-4 w-14"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-card-border/50 hover:bg-card-hover transition-colors">
                <td className="px-5 py-4 text-muted whitespace-nowrap">{tx.date}</td>
                <td className="px-5 py-4">
                  <div className="font-medium">{tx.merchant_name}</div>
                  {tx.note && <div className="text-sm text-muted mt-1">{tx.note}</div>}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      CATEGORY_COLORS[tx.category] || "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {tx.category}
                  </span>
                </td>
                <td className={`px-5 py-4 text-right font-mono text-xl font-bold ${
                  tx.type === "credit" ? "text-green" : "text-accent"
                }`}>
                  {tx.type === "credit" ? "+" : "-"}{new Intl.NumberFormat("en-IN").format(tx.amount)}
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="text-muted hover:text-accent transition-colors text-2xl leading-none"
                    title="Delete"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
