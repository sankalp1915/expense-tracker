"use client";

import { useState, useEffect, useCallback } from "react";
import SummaryCards from "@/components/SummaryCards";
import CategoryChart from "@/components/CategoryChart";
import TransactionTable from "@/components/TransactionTable";
import AddTransactionForm from "@/components/AddTransactionForm";
import SalaryInput from "@/components/SalaryInput";
import MonthSelector from "@/components/MonthSelector";
import KeywordManager from "@/components/KeywordManager";

interface CategoryBreakdown {
  category: string;
  total: number;
}

interface Transaction {
  id: number;
  amount: number;
  merchant_name: string;
  category: string;
  date: string;
  month: string;
  note: string;
  created_at: string;
}

interface Summary {
  month: string;
  salary: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: CategoryBreakdown[];
  availableMonths: string[];
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function Home() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "keywords">("dashboard");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [sumRes, txRes] = await Promise.all([
      fetch(`/api/summary?month=${month}`),
      fetch(`/api/transactions?month=${month}`),
    ]);
    const sumData = await sumRes.json();
    const txData = await txRes.json();
    setSummary(sumData);
    setTransactions(txData.transactions || []);
    setLoading(false);
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteTransaction = async (id: number) => {
    await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Expense Tracker
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-accent text-white"
                : "bg-card border border-card-border text-muted hover:text-foreground"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("keywords")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "keywords"
                ? "bg-accent text-white"
                : "bg-card border border-card-border text-muted hover:text-foreground"
            }`}
          >
            Keywords
          </button>
        </div>
      </div>

      {activeTab === "keywords" ? (
        <KeywordManager />
      ) : (
        <>
          {/* Month selector + Salary */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <MonthSelector
              month={month}
              onChange={setMonth}
              availableMonths={summary?.availableMonths || []}
            />
            <SalaryInput month={month} currentSalary={summary?.salary ?? 0} onUpdate={fetchData} />
          </div>

          {loading ? (
            <div className="text-center text-muted py-20">Loading...</div>
          ) : (
            <>
              {/* Summary Cards */}
              <SummaryCards
                salary={summary?.salary ?? 0}
                totalExpenses={summary?.totalExpenses ?? 0}
                balance={summary?.balance ?? 0}
              />

              {/* Chart + Add Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <CategoryChart breakdown={summary?.categoryBreakdown ?? []} />
                <AddTransactionForm month={month} onAdd={fetchData} />
              </div>

              {/* Transaction Table */}
              <div className="mt-6">
                <TransactionTable
                  transactions={transactions}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
