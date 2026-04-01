"use client";

import { useState } from "react";

const CATEGORIES = ["Rent", "Food", "Travel", "Personal", "Medicine", "Settlement", "Not Necessary"];

export default function AddTransactionForm({
  month,
  onAdd,
}: {
  month: string;
  onAdd: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant || !date) return;

    setSubmitting(true);
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(amount),
        merchant_name: merchant,
        date,
        category: category || undefined,
        note,
      }),
    });

    setAmount("");
    setMerchant("");
    setCategory("");
    setNote("");
    setSubmitting(false);
    onAdd();
  };

  const inputClass =
    "w-full bg-[#0a0a0a] border border-card-border rounded-md px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="bg-card border border-card-border rounded-xl p-6">
      <h3 className="text-lg font-bold text-foreground uppercase tracking-wider mb-5">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            required
            min="0"
            step="0.01"
          />
          <input
            type="text"
            placeholder="Merchant name"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">Auto-detect category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent hover:bg-accent-light text-white font-bold py-3.5 rounded-md text-lg uppercase tracking-wider transition-all duration-200 disabled:opacity-50 shadow-lg shadow-accent/20 hover:shadow-accent/40"
        >
          {submitting ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
