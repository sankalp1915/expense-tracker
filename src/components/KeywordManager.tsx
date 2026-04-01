"use client";

import { useState, useEffect } from "react";

interface Keyword {
  id: number;
  keyword: string;
  category: string;
}

const CATEGORIES = ["Rent", "Food", "Travel", "Personal", "Medicine", "Settlement", "Not Necessary"];

const CATEGORY_COLORS: Record<string, string> = {
  Rent: "bg-indigo-500/20 text-indigo-400",
  Food: "bg-amber-500/20 text-amber-400",
  Travel: "bg-blue-500/20 text-blue-400",
  Personal: "bg-violet-500/20 text-violet-400",
  Medicine: "bg-red-500/20 text-red-400",
  Settlement: "bg-teal-500/20 text-teal-400",
  "Not Necessary": "bg-orange-500/20 text-orange-400",
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

  return (
    <div className="space-y-6">
      <div className="bg-card border border-card-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-muted mb-4">Add Keyword Mapping</h3>
        <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Keyword (e.g. zomato)"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground flex-1 min-w-[200px] focus:outline-none focus:border-accent"
            required
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-accent text-white px-6 py-2 rounded-lg text-sm hover:bg-accent-light transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-medium text-muted">
            Keyword Dictionary ({filtered.length})
          </h3>
          <div className="flex gap-1 flex-wrap">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  filter === cat
                    ? "bg-accent text-white"
                    : "bg-background text-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {filtered.map((kw) => (
            <div
              key={kw.id}
              className="flex items-center justify-between bg-background rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{kw.keyword}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    CATEGORY_COLORS[kw.category] || "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {kw.category}
                </span>
              </div>
              <button
                onClick={() => handleDelete(kw.id)}
                className="text-muted hover:text-red transition-colors ml-2"
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
