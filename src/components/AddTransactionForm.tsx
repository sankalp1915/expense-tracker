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
        category: category || undefined, // let backend auto-categorize if empty
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
    "w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent";

  return (
    <div className="bg-card border border-card-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted mb-4">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
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
          className="w-full bg-accent hover:bg-accent-light text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
