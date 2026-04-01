"use client";

import { useState, useEffect, useCallback } from "react";
import SummaryCards from "@/components/SummaryCards";
import SpendingRing from "@/components/SpendingRing";
import CategoryChart from "@/components/CategoryChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import TransactionTable from "@/components/TransactionTable";
import AddTransactionForm from "@/components/AddTransactionForm";
import SalaryInput from "@/components/SalaryInput";
import MonthSelector from "@/components/MonthSelector";
import KeywordManager from "@/components/KeywordManager";

interface CategoryBreakdownData {
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
  type: string;
  created_at: string;
}

interface Summary {
  month: string;
  salary: number;
  totalExpenses: number;
  totalCredits: number;
  balance: number;
  categoryBreakdown: CategoryBreakdownData[];
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
    <main className="min-h-screen p-5 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-accent">
          EXPENSE TRACKER
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 rounded-md text-base font-bold tracking-wide uppercase transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-accent text-white shadow-lg shadow-accent/30"
                : "bg-card border border-card-border text-muted hover:text-foreground hover:bg-card-hover"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("keywords")}
            className={`px-6 py-3 rounded-md text-base font-bold tracking-wide uppercase transition-all duration-200 ${
              activeTab === "keywords"
                ? "bg-accent text-white shadow-lg shadow-accent/30"
                : "bg-card border border-card-border text-muted hover:text-foreground hover:bg-card-hover"
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
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <MonthSelector
              month={month}
              onChange={setMonth}
              availableMonths={summary?.availableMonths || []}
            />
            <SalaryInput month={month} currentSalary={summary?.salary ?? 0} onUpdate={fetchData} />
          </div>

          {loading ? (
            <div className="text-center text-muted py-20 text-xl">Loading...</div>
          ) : (
            <>
              {/* Row 1: Summary Cards */}
              <SummaryCards
                salary={summary?.salary ?? 0}
                totalExpenses={summary?.totalExpenses ?? 0}
                totalCredits={summary?.totalCredits ?? 0}
                balance={summary?.balance ?? 0}
              />

              {/* Row 2: Spending Ring + Donut Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <SpendingRing
                  salary={summary?.salary ?? 0}
                  totalExpenses={summary?.totalExpenses ?? 0}
                  balance={summary?.balance ?? 0}
                />
                <CategoryChart
                  breakdown={summary?.categoryBreakdown ?? []}
                  totalExpenses={summary?.totalExpenses ?? 0}
                />
              </div>

              {/* Row 3: Category Breakdown + Add Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <CategoryBreakdown
                  breakdown={summary?.categoryBreakdown ?? []}
                  totalExpenses={summary?.totalExpenses ?? 0}
                />
                <AddTransactionForm month={month} onAdd={fetchData} />
              </div>

              {/* Row 4: Transactions */}
              <div className="mt-8">
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
