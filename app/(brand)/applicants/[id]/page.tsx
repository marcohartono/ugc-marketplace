"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Award, TrendingUp, ExternalLink, Check } from "lucide-react";
import { creators, briefs, brands } from "@/lib/mockData";
import { useAppStore } from "@/lib/stores/appStore";
import { useBrandStore } from "@/lib/stores/brandStore";
import { formatIDR } from "@/lib/utils";
import { WhatsAppToast, useWAToast } from "@/components/shared/WhatsAppToast";
import { cn } from "@/lib/utils";

const PORTFOLIO_ITEMS = [
  { emoji: "🎬", views: "82k" },
  { emoji: "💄", views: "110k" },
  { emoji: "☕", views: "44k" },
  { emoji: "✨", views: "67k" },
  { emoji: "🌿", views: "91k" },
  { emoji: "📸", views: "38k" },
];

const TIER_STYLE = {
  Pemula: { color: "text-muted-foreground", bg: "bg-bone-dark", emoji: "🌱" },
  Rising: { color: "text-amber-700",        bg: "bg-amber/20",   emoji: "⭐" },
  Pro:    { color: "text-terracotta",        bg: "bg-terracotta/10", emoji: "🔥" },
};

export default function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { applications } = useAppStore();
  const { selectedApps, shortlistedApps, hireApp, shortlistApp } = useBrandStore();
  const waToast = useWAToast();

  const [hired, setHired] = useState(false);

  const app = applications.find((a) => a.id === id);
  const creator = app ? creators.find((c) => c.id === app.creator_id) : null;
  const brief = app ? briefs.find((b) => b.id === app.brief_id) : null;
  const brand = brief ? brands.find((b) => b.id === brief.brand_id) : null;

  if (!app || !creator || !brief) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Pelamar tidak ditemukan.</p>
      </div>
    );
  }

  const isAlreadySelected = selectedApps.includes(app.id) || app.status === "Dipilih!";
  const isShortlisted = shortlistedApps.includes(app.id);
  const tier = TIER_STYLE[creator.tier];

  const handleHire = () => {
    hireApp(app.id);
    setHired(true);
    waToast.trigger(
      `${creator.name} sudah kamu pilih untuk brief "${brief.title}"! Dana escrow akan segera aktif. 💚`
    );
  };

  return (
    <>
      <WhatsAppToast
        show={waToast.show}
        message={waToast.message}
        onClose={waToast.close}
        senderName="KONTENIN"
      />

      <div className="min-h-screen pb-28">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-bone/95 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="text-sm font-semibold text-espresso">Profil pelamar</p>
        </div>

        {/* Creator header */}
        <div className="bg-espresso px-5 pt-6 pb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-bone-dark rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              {creator.avatar}
            </div>
            <div className="flex-1">
              <h1
                className="text-xl font-bold text-bone mb-0.5"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {creator.name}
              </h1>
              <p className="text-bone/60 text-sm">{creator.city} · {creator.niches.slice(0, 2).join(", ")}</p>
              <div className={cn("inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold", tier.bg, tier.color)}>
                {tier.emoji} {creator.tier}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Gig selesai", value: creator.gigs_completed, icon: <Award className="w-3.5 h-3.5" /> },
              { label: "Rating", value: creator.avg_rating, icon: <Star className="w-3.5 h-3.5" /> },
              { label: "Total earned", value: formatIDR(creator.total_earned, true), icon: <TrendingUp className="w-3.5 h-3.5" /> },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-bone/60 flex justify-center mb-1">{s.icon}</p>
                <p className="text-bone font-bold text-sm">{s.value}</p>
                <p className="text-bone/50 text-[10px] mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pt-5 space-y-5">
          {/* Bio */}
          <div className="bg-white border border-border rounded-2xl p-4">
            <p className="text-xs font-semibold text-espresso uppercase tracking-widest mb-2">Bio</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{creator.bio}</p>
          </div>

          {/* Pitch for this brief */}
          <div className="bg-white border border-border rounded-2xl p-4">
            <p className="text-xs font-semibold text-espresso uppercase tracking-widest mb-1">Pitch untuk brief ini</p>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{brief.title}</p>
            <p className="text-sm text-espresso leading-relaxed">{app.pitch}</p>
            {app.portfolio_link && (
              <a
                href={app.portfolio_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-terracotta font-medium mt-3"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Lihat portfolio / konten serupa
              </a>
            )}
          </div>

          {/* Social links */}
          <div className="bg-white border border-border rounded-2xl p-4">
            <p className="text-xs font-semibold text-espresso uppercase tracking-widest mb-3">Sosial media</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Instagram</span>
                <span className="text-sm font-medium text-espresso">{creator.ig_handle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">TikTok</span>
                <span className="text-sm font-medium text-espresso">{creator.tiktok_handle}</span>
              </div>
            </div>
          </div>

          {/* Portfolio grid */}
          <div>
            <p
              className="text-base font-bold text-espresso mb-3"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Contoh konten
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PORTFOLIO_ITEMS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-[9/16] bg-bone-dark rounded-xl flex flex-col items-center justify-between p-2"
                >
                  <span className="text-2xl mt-3">{p.emoji}</span>
                  <div className="w-full bg-black/10 rounded-lg px-2 py-1 text-center">
                    <p className="text-[10px] font-semibold text-espresso">{p.views} views</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Budget context */}
          <div className="bg-terracotta/10 rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Budget untuk brief ini</p>
            <p
              className="text-2xl font-bold text-terracotta"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {formatIDR(brief.budget_min, true)} – {formatIDR(brief.budget_max, true)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">per konten · escrow aktif setelah konfirmasi</p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 pb-8 pt-3 bg-gradient-to-t from-bone via-bone to-transparent z-20">
        <div className="flex gap-3">
          {!isAlreadySelected && (
            <button
              onClick={() => shortlistApp(app.id)}
              className={cn(
                "flex-1 py-4 rounded-full border-2 font-semibold text-sm transition-all",
                isShortlisted
                  ? "border-terracotta text-terracotta bg-terracotta/5"
                  : "border-border text-espresso hover:border-terracotta/40"
              )}
            >
              {isShortlisted ? "Shortlisted ✓" : "Shortlist"}
            </button>
          )}
          <button
            onClick={!isAlreadySelected ? handleHire : undefined}
            disabled={false}
            className={cn(
              "flex-1 py-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2",
              isAlreadySelected
                ? "bg-[#25D366] text-white cursor-default"
                : "bg-espresso text-bone hover:bg-espresso-light active:scale-[0.98]"
            )}
          >
            {isAlreadySelected ? (
              <><Check className="w-4 h-4" /> Sudah dipilih</>
            ) : (
              "Pilih kreator ini"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
