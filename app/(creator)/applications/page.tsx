"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";
import { useUserStore } from "@/lib/stores/userStore";
import { briefs, brands } from "@/lib/mockData";
import { relativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/mockData";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  "Menunggu review": { label: "Menunggu review", color: "text-amber-700", bg: "bg-amber/20" },
  Shortlisted: { label: "Shortlisted 🔥", color: "text-terracotta", bg: "bg-terracotta/10" },
  "Dipilih!": { label: "Dipilih! 🎉", color: "text-[#1DA851]", bg: "bg-[#25D366]/15" },
  "Tidak dipilih": { label: "Tidak dipilih", color: "text-muted-foreground", bg: "bg-bone-dark" },
};

export default function ApplicationsPage() {
  const { currentUser } = useUserStore();
  const { applications } = useAppStore();

  const myApps = applications.filter((a) => a.creator_id === currentUser.id);

  const chosen = myApps.filter((a) => a.status === "Dipilih!");
  const active = myApps.filter((a) => a.status === "Shortlisted" || a.status === "Menunggu review");
  const past = myApps.filter((a) => a.status === "Tidak dipilih");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bone/95 backdrop-blur-sm border-b border-border px-5 pt-12 pb-4">
        <h1
          className="text-2xl font-bold text-espresso"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          Pitches kamu
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {myApps.length} pitch dikirim
        </p>
      </div>

      <div className="px-5 pt-4 space-y-6">
        {myApps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📭</p>
            <h3
              className="text-xl font-bold text-espresso mb-2"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Belum ada pitch nih
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Yuk cari brief yang cocok dan ajuin diri kamu pertama kali!
            </p>
            <Link
              href="/feed"
              className="bg-terracotta text-white px-6 py-3 rounded-full text-sm font-semibold"
            >
              Browse brief
            </Link>
          </div>
        ) : (
          <>
            {chosen.length > 0 && (
              <Group title="Kamu dipilih! 🎉">
                {chosen.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} />
                ))}
              </Group>
            )}

            {active.length > 0 && (
              <Group title="Sedang diproses">
                {active.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} />
                ))}
              </Group>
            )}

            {past.length > 0 && (
              <Group title="Sebelumnya">
                <div className="bg-bone-dark/50 rounded-xl px-4 py-3 mb-3">
                  <p className="text-xs text-muted-foreground text-center">
                    💪 Nggak dipilih kali ini, tapi jangan nyerah ya. Setiap pitch itu latihan.
                  </p>
                </div>
                {past.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} faded />
                ))}
              </Group>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium"
      >
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AppCard({ app, index, faded = false }: { app: ReturnType<typeof useAppStore.getState>["applications"][0]; index: number; faded?: boolean }) {
  const brief = briefs.find((b) => b.id === app.brief_id);
  const brand = brief ? brands.find((b) => b.id === brief.brand_id) : null;
  if (!brief || !brand) return null;

  const status = STATUS_CONFIG[app.status];
  const isChosen = app.status === "Dipilih!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        href={isChosen && app.job_id ? `/jobs/${app.job_id}` : `/brief/${brief.id}`}
        className={cn(
          "block bg-white rounded-2xl border border-border p-4 transition-all hover:shadow-sm active:scale-[0.99]",
          faded && "opacity-60"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-bone-dark rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            {brand.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-espresso leading-snug line-clamp-2 flex-1">
                {brief.title}
              </p>
              {isChosen && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{brand.name}</p>
            <div className="flex items-center justify-between">
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", status.bg, status.color)}>
                {status.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {relativeDate(app.applied_at)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
