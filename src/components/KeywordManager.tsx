"use client";

import { useState, useEffect } from "react";

interface Keyword {
  id: number;
  keyword: string;
  category: string;
}

const CATEGORIES = ["Rent", "Food", "Travel", "Personal", "Medicine", "Settlement", "Not Necessary"];

const CATEGORY_COLORS: Record<string, string> = {
  Rent: "bg-indigo-500/20 text-indigo-300",
  Food: "bg-amber-500/20 text-amber-300",
  Travel: "bg-blue-500/20 text-blue-300",
  Personal: "bg-violet-500/20 text-violet-300",
  Medicine: "bg-red-500/20 text-red-300",
  Settlement: "bg-teal-500/20 text-teal-300",
  "Not Necessary": "bg-orange-500/20 text-orange-300",
};

export default function KeywordManager() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState("Food");
  const [filter, setFilter] = useState("All");

  const fetchKeywords = async () => {
    const res = await fetch("/api/keywords");
    const data = await res.json();
    setKeywords(data.keywords || []);
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    await fetch("/api/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: newKeyword.trim(), category: newCategory }),
    });
    setNewKeyword("");
    fetchKeywords();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/keywords?id=${id}`, { method: "DELETE" });
    fetchKeywords();
  };

  const filtered = filter === "All" ? keywords : keywords.filter((k) => k.category === filter);

  const inputClass =
    "bg-[#0a0a0a] border border-card-border rounded-md px-4 py-3 text-base text-foreground focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="space-y-8">
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-foreground uppercase tracking-wider mb-5">Add Keyword Mapping</h3>
        <form onSubmit={handleAdd} className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Keyword (e.g. zomato)"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className={`${inputClass} flex-1 min-w-[200px]`}
            required
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-accent text-white px-8 py-3 rounded-md text-base font-bold uppercase tracking-wider hover:bg-accent-light transition-all duration-200 shadow-lg shadow-accent/20"
          >
            Add
          </button>
        </form>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
            Keyword Dictionary <span className="text-muted">({filtered.length})</span>
          </h3>
          <div className="flex gap-2 flex-wrap">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                  filter === cat
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-[#0a0a0a] text-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((kw) => (
            <div
              key={kw.id}
              className="flex items-center justify-between bg-[#0a0a0a] rounded-lg px-4 py-3 hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{kw.keyword}</span>
                <span
                  className={`text-sm px-2.5 py-0.5 rounded-full font-bold ${
                    CATEGORY_COLORS[kw.category] || "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {kw.category}
                </span>
              </div>
              <button
                onClick={() => handleDelete(kw.id)}
                className="text-muted hover:text-accent transition-colors ml-3 text-xl"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
