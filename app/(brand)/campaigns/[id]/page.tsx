"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Star, Clock, ChevronRight } from "lucide-react";
import { briefs, brands, creators, type Application } from "@/lib/mockData";
import { useAppStore } from "@/lib/stores/appStore";
import { useBrandStore } from "@/lib/stores/brandStore";
import { formatIDR, deadlineLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ApplicationStatus, City, Niche } from "@/lib/mockData";

const STATUS_ORDER: ApplicationStatus[] = ["Dipilih!", "Shortlisted", "Menunggu review", "Tidak dipilih"];

const STATUS_STYLE: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  "Dipilih!":        { label: "Dipilih ✓",        color: "text-[#1DA851]",    bg: "bg-[#25D366]/15" },
  Shortlisted:       { label: "Shortlisted 🔥",   color: "text-terracotta",   bg: "bg-terracotta/10" },
  "Menunggu review": { label: "Belum diproses",    color: "text-amber-700",    bg: "bg-amber/20" },
  "Tidak dipilih":   { label: "Tidak dipilih",     color: "text-muted-foreground", bg: "bg-bone-dark" },
};

const CITIES: City[] = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Lainnya"];
const NICHES: Niche[] = ["Fashion", "F&B", "Beauty", "Tech", "Lifestyle", "Gaming", "Edukasi", "Travel"];

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { applications } = useAppStore();
  const { shortlistedApps, selectedApps, shortlistApp, hireApp, publishedBriefs } = useBrandStore();

  const brief = [...publishedBriefs, ...briefs].find((b) => b.id === id);
  const brand = brief ? brands.find((b) => b.id === brief.brand_id) : null;

  const [cityFilter, setCityFilter] = useState<City | "Semua">("Semua");
  const [nicheFilter, setNicheFilter] = useState<Niche | "Semua">("Semua");
  const [showFilters, setShowFilters] = useState(false);

  if (!brief || !brand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Campaign tidak ditemukan.</p>
      </div>
    );
  }

  const briefApplicants = applications
    .filter((a) => a.brief_id === brief.id)
    .map((a) => ({
      ...a,
      status: selectedApps.includes(a.id)
        ? "Dipilih!" as ApplicationStatus
        : shortlistedApps.includes(a.id)
        ? "Shortlisted" as ApplicationStatus
        : a.status,
    }))
    .filter((a) => {
      const creator = creators.find((c) => c.id === a.creator_id);
      const matchCity = cityFilter === "Semua" || creator?.city === cityFilter;
      const matchNiche = nicheFilter === "Semua" || creator?.niches.includes(nicheFilter);
      return matchCity && matchNiche;
    })
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  const stats = {
    total: applications.filter((a) => a.brief_id === brief.id).length,
    selected: applications.filter((a) => a.brief_id === brief.id && (selectedApps.includes(a.id) || a.status === "Dipilih!")).length,
    shortlisted: shortlistedApps.filter((id) => applications.find((a) => a.id === id && a.brief_id === brief.id)).length,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bone/95 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <p className="text-sm font-semibold text-espresso flex-1 line-clamp-1">{brief.title}</p>
      </div>

      {/* Brief summary */}
      <div className="bg-white border-b border-border px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 bg-bone-dark text-espresso rounded-full font-medium">{brief.category}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{deadlineLabel(brief.deadline)}</span>
        </div>
        <p
          className="text-xl font-bold text-terracotta"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          {formatIDR(brief.budget_min, true)} – {formatIDR(brief.budget_max, true)}
        </p>
        <p className="text-xs text-muted-foreground">{brief.slots_remaining}/{brief.slots_total} slot tersisa</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-border bg-bone-dark/50">
        {[
          { label: "Total pelamar", value: stats.total },
          { label: "Shortlisted", value: stats.shortlisted },
          { label: "Dipilih", value: stats.selected },
        ].map((s) => (
          <div key={s.label} className="text-center py-3">
            <p
              className="text-2xl font-bold text-espresso"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {s.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-base font-bold text-espresso"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Pelamar ({briefApplicants.length})
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              showFilters || cityFilter !== "Semua" || nicheFilter !== "Semua"
                ? "border-terracotta text-terracotta bg-terracotta/5"
                : "border-border text-muted-foreground"
            )}
          >
            <Filter className="w-3 h-3" />
            Filter
            {(cityFilter !== "Semua" || nicheFilter !== "Semua") && (
              <span className="w-4 h-4 bg-terracotta text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {(cityFilter !== "Semua" ? 1 : 0) + (nicheFilter !== "Semua" ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 mb-3"
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Kota</p>
              <div className="flex gap-2 flex-wrap">
                {(["Semua", ...CITIES] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCityFilter(c as City | "Semua")}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all",
                      cityFilter === c
                        ? "border-espresso bg-espresso text-bone"
                        : "border-border bg-white text-espresso"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Niche</p>
              <div className="flex gap-2 flex-wrap">
                {(["Semua", ...NICHES] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNicheFilter(n as Niche | "Semua")}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all",
                      nicheFilter === n
                        ? "border-espresso bg-espresso text-bone"
                        : "border-border bg-white text-espresso"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Applicant list */}
      <div className="px-5 pb-8 space-y-3">
        {briefApplicants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-muted-foreground text-sm">Belum ada pelamar untuk filter ini.</p>
          </div>
        ) : (
          briefApplicants.map((app, i) => (
            <ApplicantRow
              key={app.id}
              app={app}
              index={i}
              onShortlist={() => shortlistApp(app.id)}
              onHire={() => hireApp(app.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ApplicantRow({
  app, index, onShortlist, onHire,
}: {
  app: Application & { status: ApplicationStatus };
  index: number;
  onShortlist: () => void;
  onHire: () => void;
}) {
  const creator = creators.find((c) => c.id === app.creator_id);
  const router = useRouter();
  if (!creator) return null;

  const s = STATUS_STYLE[app.status];
  const isSelected = app.status === "Dipilih!";
  const isShortlisted = app.status === "Shortlisted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white border border-border rounded-2xl p-4"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 bg-bone-dark rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {creator.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-espresso">{creator.name}</p>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0", s.bg, s.color)}>
              {s.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {creator.city} · {creator.niches.join(", ")}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber text-amber" />
              {creator.avg_rating}
            </span>
            <span>·</span>
            <span>{creator.gigs_completed} gig selesai</span>
            <span>·</span>
            <span className="font-medium text-terracotta">{creator.tier}</span>
          </div>
        </div>
      </div>

      {/* Pitch preview */}
      <div className="bg-bone rounded-xl px-3 py-2.5 mb-3">
        <p className="text-xs text-muted-foreground mb-1">Pitch:</p>
        <p className="text-xs text-espresso leading-relaxed line-clamp-3">{app.pitch}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(`/applicants/${app.id}`)}
          className="flex-1 py-2 rounded-xl border border-border text-xs font-medium text-espresso flex items-center justify-center gap-1 hover:bg-bone transition-colors"
        >
          Lihat detail <ChevronRight className="w-3 h-3" />
        </button>
        {!isSelected && (
          <>
            <button
              onClick={onShortlist}
              className={cn(
                "flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-colors",
                isShortlisted
                  ? "border-terracotta bg-terracotta/5 text-terracotta"
                  : "border-border text-muted-foreground hover:border-terracotta/40"
              )}
            >
              {isShortlisted ? "Shortlisted ✓" : "Shortlist"}
            </button>
            <button
              onClick={onHire}
              className="flex-1 py-2 rounded-xl bg-espresso text-bone text-xs font-semibold hover:bg-espresso-light transition-colors"
            >
              Pilih kreator
            </button>
          </>
        )}
        {isSelected && (
          <div className="flex-1 text-center py-2 text-xs font-semibold text-[#1DA851]">
            Sudah dipilih ✓
          </div>
        )}
      </div>
    </motion.div>
  );
}
