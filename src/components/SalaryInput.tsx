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
        className="bg-card border border-card-border rounded-md px-5 py-3 text-base text-muted hover:text-foreground hover:border-accent transition-all duration-200"
      >
        {currentSalary
          ? `Salary: ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(currentSalary)}`
          : "Set Salary"}
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <input
        type="number"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="Monthly salary"
        className="bg-[#0a0a0a] border border-card-border rounded-md px-4 py-3 text-base text-foreground w-48 focus:outline-none focus:border-accent transition-colors"
        autoFocus
      />
      <button
        onClick={handleSave}
        className="bg-accent text-white px-5 py-3 rounded-md text-base font-bold hover:bg-accent-light transition-all duration-200 shadow-lg shadow-accent/20"
      >
        Save
      </button>
      <button
        onClick={() => setEditing(false)}
        className="text-muted hover:text-foreground px-3 text-base transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
