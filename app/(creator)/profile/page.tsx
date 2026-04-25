"use client";
import { motion } from "framer-motion";
import { Star, ExternalLink, Link2, TrendingUp, Award } from "lucide-react";
import { useUserStore } from "@/lib/stores/userStore";
import { useAppStore } from "@/lib/stores/appStore";
import { formatIDR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TIER_CONFIG = {
  Pemula: { color: "text-muted-foreground", bg: "bg-bone-dark", emoji: "🌱" },
  Rising: { color: "text-amber-700", bg: "bg-amber/20", emoji: "⭐" },
  Pro: { color: "text-terracotta", bg: "bg-terracotta/10", emoji: "🔥" },
};

const PORTFOLIO_PLACEHOLDERS = [
  { bg: "bg-espresso/10", emoji: "🎬", views: "82k" },
  { bg: "bg-terracotta/10", emoji: "💄", views: "110k" },
  { bg: "bg-amber/20", emoji: "☕", views: "44k" },
  { bg: "bg-bone-dark", emoji: "✨", views: "67k" },
  { bg: "bg-espresso/10", emoji: "🌿", views: "91k" },
  { bg: "bg-terracotta/10", emoji: "📸", views: "38k" },
];

export default function ProfilePage() {
  const { currentUser } = useUserStore();
  const { applications } = useAppStore();

  const myApps = applications.filter((a) => a.creator_id === currentUser.id);
  const tier = TIER_CONFIG[currentUser.tier];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-espresso px-5 pt-14 pb-8 relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-bone/60 text-xs mb-1">Profil kreator</p>
            <h1
              className="text-2xl font-bold text-bone"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {currentUser.name}
            </h1>
            <p className="text-bone/60 text-sm mt-0.5">
              {currentUser.city} · {currentUser.niches.slice(0, 2).join(", ")}
            </p>
          </div>
          <div className="w-16 h-16 bg-bone-dark rounded-2xl flex items-center justify-center text-4xl">
            {currentUser.avatar}
          </div>
        </div>

        {/* Tier badge */}
        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold", tier.bg, tier.color)}>
          {tier.emoji} {currentUser.tier}
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Gig selesai", value: String(currentUser.gigs_completed), icon: <Award className="w-4 h-4 text-terracotta" /> },
            { label: "Rating rata-rata", value: `${currentUser.avg_rating} ⭐`, icon: <Star className="w-4 h-4 text-amber" /> },
            { label: "Total earned", value: formatIDR(currentUser.total_earned, true), icon: <TrendingUp className="w-4 h-4 text-[#25D366]" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-border rounded-2xl p-3 text-center">
              <div className="flex justify-center mb-1.5">{s.icon}</div>
              <p
                className="text-lg font-bold text-espresso leading-none"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {s.value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-espresso">Bio</p>
            <button className="text-xs text-terracotta font-medium">Edit</button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{currentUser.bio}</p>
        </div>

        {/* Niches */}
        <div className="bg-white border border-border rounded-2xl p-4">
          <p className="text-sm font-semibold text-espresso mb-3">Kategori konten</p>
          <div className="flex flex-wrap gap-2">
            {currentUser.niches.map((n) => (
              <span
                key={n}
                className="text-xs px-3 py-1.5 bg-bone-dark text-espresso rounded-full font-medium"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div className="bg-white border border-border rounded-2xl p-4">
          <p className="text-sm font-semibold text-espresso mb-3">Sosial media</p>
          <div className="space-y-2">
            <SocialRow icon={<Link2 className="w-4 h-4" />} label="Instagram" handle={currentUser.ig_handle} />
            <SocialRow icon={<span className="text-sm">🎵</span>} label="TikTok" handle={currentUser.tiktok_handle} />
          </div>
        </div>

        {/* Portfolio grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-lg font-bold text-espresso"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Portfolio
            </p>
            <button className="text-xs text-terracotta font-medium">+ Tambah</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PORTFOLIO_PLACEHOLDERS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "aspect-[9/16] rounded-xl flex flex-col items-center justify-between p-2 relative overflow-hidden",
                  p.bg
                )}
              >
                <span className="text-2xl mt-3">{p.emoji}</span>
                <div className="w-full bg-black/20 rounded-lg px-2 py-1 text-center">
                  <p className="text-[10px] font-semibold text-espresso">{p.views} views</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payout method */}
        <div className="bg-white border border-border rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-espresso">Metode payout</p>
              <p className="text-xs text-muted-foreground mt-0.5">{currentUser.payout_account}</p>
            </div>
            <button className="text-xs text-terracotta font-medium">Ubah</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialRow({ icon, label, handle }: { icon: React.ReactNode; label: string; handle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-bone-dark rounded-lg flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-espresso font-medium">{handle}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
    </div>
  );
}
