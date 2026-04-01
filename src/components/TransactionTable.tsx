"use client";

interface Transaction {
  id: number;
  amount: number;
  merchant_name: string;
  category: string;
  date: string;
  note: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Rent: "bg-indigo-500/20 text-indigo-400",
  Food: "bg-amber-500/20 text-amber-400",
  Travel: "bg-blue-500/20 text-blue-400",
  Personal: "bg-violet-500/20 text-violet-400",
  Medicine: "bg-red-500/20 text-red-400",
  Settlement: "bg-teal-500/20 text-teal-400",
  "Not Necessary": "bg-orange-500/20 text-orange-400",
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
      <div className="bg-card border border-card-border rounded-xl p-8 text-center text-muted">
        No transactions this month
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-card-border">
        <h3 className="text-sm font-medium text-muted">
          Transactions ({transactions.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-muted text-left">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Merchant</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium w-12"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-card-border/50 hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-muted whitespace-nowrap">{tx.date}</td>
                <td className="px-4 py-3">
                  <div>{tx.merchant_name}</div>
                  {tx.note && <div className="text-xs text-muted mt-0.5">{tx.note}</div>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      CATEGORY_COLORS[tx.category] || "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {tx.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-red">
                  -{new Intl.NumberFormat("en-IN").format(tx.amount)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="text-muted hover:text-red transition-colors text-lg leading-none"
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
