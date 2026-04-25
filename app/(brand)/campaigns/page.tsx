"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Clock, ChevronRight } from "lucide-react";
import { useBrandStore } from "@/lib/stores/brandStore";
import { useAppStore } from "@/lib/stores/appStore";
import { briefs } from "@/lib/mockData";
import { formatIDR, deadlineLabel, isUrgent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";

export default function CampaignsPage() {
  const { currentBrand, publishedBriefs } = useBrandStore();
  const { applications } = useAppStore();
  const t = useT();

  const ownedBriefs = [
    ...publishedBriefs,
    ...briefs.filter((b) => b.brand_id === currentBrand.id),
  ];

  const totalApplicants = applications.filter((a) =>
    ownedBriefs.some((b) => b.id === a.brief_id)
  ).length;

  const totalSelected = applications.filter(
    (a) => ownedBriefs.some((b) => b.id === a.brief_id) && a.status === "Dipilih!"
  ).length;

  return (
    <div className="px-5 pt-6 pb-10">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: t.campaigns.statTotal, value: ownedBriefs.length, icon: "📋" },
          { label: t.campaigns.statApplicants, value: totalApplicants, icon: "👥" },
          { label: t.campaigns.statSelected, value: totalSelected, icon: "✅" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-2xl p-3 text-center">
            <p className="text-xl mb-1">{s.icon}</p>
            <p
              className="text-2xl font-bold text-espresso"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {s.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-bold text-espresso"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          {t.campaigns.active}
        </h2>
      </div>

      {ownedBriefs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📝</p>
          <h3
            className="text-xl font-bold text-espresso mb-2"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {t.campaigns.noBriefs}
          </h3>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {ownedBriefs.map((brief) => {
            const applicantCount = applications.filter((a) => a.brief_id === brief.id).length;
            const selectedCount = applications.filter(
              (a) => a.brief_id === brief.id && a.status === "Dipilih!"
            ).length;
            const urgent = isUrgent(brief.deadline);
            const isNew = publishedBriefs.some((b) => b.id === brief.id);

            return (
              <motion.div
                key={brief.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              >
                <Link href={`/campaigns/${brief.id}`}>
                  <div className="bg-white border border-border rounded-2xl p-4 hover:shadow-sm transition-all active:scale-[0.99]">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-bone-dark text-espresso rounded-full font-medium">
                            {brief.category}
                          </span>
                          {isNew && (
                            <span className="text-xs px-2 py-0.5 bg-[#25D366]/15 text-[#1DA851] rounded-full font-medium">
                              ✓ Published
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-espresso line-clamp-2 leading-snug">
                          {brief.title}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <p
                        className="text-lg font-bold text-terracotta"
                        style={{ fontFamily: "Fraunces, Georgia, serif" }}
                      >
                        {formatIDR(brief.budget_min, true)} – {formatIDR(brief.budget_max, true)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {t.campaigns.applicants(applicantCount)}
                        {selectedCount > 0 && (
                          <span className="text-[#1DA851] font-medium ml-1">
                            · {selectedCount} selected
                          </span>
                        )}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1",
                          urgent && "text-terracotta font-medium"
                        )}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {deadlineLabel(brief.deadline)}
                      </span>
                      <span className="ml-auto">
                        {t.campaigns.slotsLeft(brief.slots_remaining, brief.slots_total)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
