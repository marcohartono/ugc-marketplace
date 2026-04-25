"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { briefs, brands, type Niche } from "@/lib/mockData";
import { useUserStore } from "@/lib/stores/userStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useBrandStore } from "@/lib/stores/brandStore";
import { BriefCard } from "@/components/creator/BriefCard";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/config";
import { useT } from "@/lib/useT";
import Link from "next/link";

const NICHE_FILTERS: (Niche | "Semua")[] = [
  "Semua", "F&B", "Beauty", "Fashion", "Tech", "Lifestyle", "Gaming", "Edukasi", "Travel",
];

export default function FeedPage() {
  const { currentUser } = useUserStore();
  const { notifications } = useAppStore();
  const { publishedBriefs } = useBrandStore();
  const t = useT();
  const allBriefs = [...publishedBriefs, ...briefs];
  const unread = notifications.filter((n) => !n.read).length;

  const [search, setSearch] = useState("");
  const [activeNiche, setActiveNiche] = useState<Niche | "Semua">("Semua");
  const [activeBudget, setActiveBudget] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const BUDGET_FILTERS = [
    { label: t.feed.budgetAll, min: 0, max: Infinity },
    { label: t.feed.budgetLow, min: 0, max: 500000 },
    { label: t.feed.budgetMid, min: 500000, max: 1000000 },
    { label: t.feed.budgetHigh, min: 1000000, max: Infinity },
  ];

  const filtered = useMemo(() => {
    const budgetFilter = BUDGET_FILTERS[activeBudget];
    return allBriefs.filter((b) => {
      const brand = brands.find((br) => br.id === b.brand_id);
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        brand?.name.toLowerCase().includes(search.toLowerCase());
      const matchNiche = activeNiche === "Semua" || b.category === activeNiche;
      const matchBudget =
        b.budget_max >= budgetFilter.min && b.budget_min <= budgetFilter.max;
      return matchSearch && matchNiche && matchBudget;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeNiche, activeBudget, t, allBriefs]);

  const resetFilters = () => {
    setSearch("");
    setActiveNiche("Semua");
    setActiveBudget(0);
  };

  const hasFilters = search || activeNiche !== "Semua" || activeBudget !== 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bone/95 backdrop-blur-sm border-b border-border px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {t.feed.greeting(currentUser.name.split(" ")[0])}
            </p>
            <h1
              className="text-xl font-bold text-espresso leading-tight"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {APP_NAME}
            </h1>
          </div>
          <Link
            href="/profile"
            className="relative w-10 h-10 rounded-full bg-bone-dark flex items-center justify-center text-xl"
          >
            {currentUser.avatar}
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder={t.feed.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-espresso placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors",
              showFilters || hasFilters
                ? "border-terracotta bg-terracotta/10 text-terracotta"
                : "border-border bg-white text-muted-foreground"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {NICHE_FILTERS.map((n) => (
            <button
              key={n}
              onClick={() => setActiveNiche(n)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeNiche === n
                  ? "bg-espresso text-bone"
                  : "bg-white border border-border text-espresso hover:border-espresso/40"
              )}
            >
              {n === "Semua" ? t.app.all : n}
            </button>
          ))}
        </div>

        {/* Extended filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-border"
          >
            <p className="text-xs font-medium text-espresso mb-2">{t.feed.budgetFilter}</p>
            <div className="flex gap-2 flex-wrap">
              {BUDGET_FILTERS.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setActiveBudget(i)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                    activeBudget === i
                      ? "border-terracotta bg-terracotta text-white"
                      : "border-border bg-white text-espresso"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Brief list */}
      <div className="px-5 pt-4 pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔍</p>
            <h3
              className="text-xl font-bold text-espresso mb-2"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {t.feed.emptyTitle}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">{t.feed.emptyDesc}</p>
            <button
              onClick={resetFilters}
              className="bg-terracotta text-white px-5 py-2.5 rounded-full text-sm font-medium"
            >
              {t.feed.resetFilters}
            </button>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            <p className="text-xs text-muted-foreground">
              {t.feed.resultsCount(filtered.length)}
            </p>
            {filtered.map((brief) => {
              const brand = brands.find((b) => b.id === brief.brand_id)!;
              return (
                <motion.div
                  key={brief.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <BriefCard brief={brief} brand={brand} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
