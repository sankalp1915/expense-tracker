"use client";

import { useState, useEffect } from "react";

export default function SalaryInput({
  month,
  currentSalary,
  onUpdate,
}: {
  month: string;
  currentSalary: number;
  onUpdate: () => void;
}) {
  const [salary, setSalary] = useState(String(currentSalary || ""));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setSalary(String(currentSalary || ""));
    setEditing(false);
  }, [currentSalary, month]);

  const handleSave = async () => {
    await fetch("/api/salary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, amount: parseFloat(salary) || 0 }),
    });
    setEditing(false);
    onUpdate();
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="bg-card border border-card-border rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground hover:border-accent transition-colors"
      >
        {currentSalary
          ? `Salary: ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(currentSalary)}`
          : "Set Salary"}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="Monthly salary"
        className="bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground w-40 focus:outline-none focus:border-accent"
        autoFocus
      />
      <button
        onClick={handleSave}
        className="bg-accent text-white px-4 py-2 rounded-lg text-sm hover:bg-accent-light transition-colors"
      >
        Save
      </button>
      <button
        onClick={() => setEditing(false)}
        className="text-muted hover:text-foreground px-2 text-sm"
      >
        Cancel
      </button>
    </div>
  );
}
