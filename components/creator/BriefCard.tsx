"use client";
import Link from "next/link";
import { Clock, Users, Play } from "lucide-react";
import { Brief, Brand } from "@/lib/mockData";
import { formatIDR, deadlineLabel, isUrgent } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BriefCardProps {
  brief: Brief;
  brand: Brand;
}

export function BriefCard({ brief, brand }: BriefCardProps) {
  const urgent = isUrgent(brief.deadline);
  const slotsLow = brief.slots_remaining <= 2;

  return (
    <Link href={`/brief/${brief.id}`} className="block">
      <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.99]">
        {/* Reference video placeholder */}
        {brief.has_reference_video && (
          <div className="h-36 bg-bone-dark relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-espresso/10 to-terracotta/10" />
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
              <Play className="w-5 h-5 text-espresso ml-0.5" fill="currentColor" />
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex gap-1.5">
              {[0.6, 0.8, 0.4, 0.9, 0.5, 0.7].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white/60 rounded-sm"
                  style={{ height: `${h * 24}px` }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Brand + category */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-bone-dark rounded-lg flex items-center justify-center text-sm">
                {brand.logo}
              </div>
              <div>
                <p className="text-xs font-medium text-espresso">{brand.name}</p>
                {brand.verified && (
                  <p className="text-[10px] text-[#25D366]">✓ Terverifikasi</p>
                )}
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-bone-dark text-espresso rounded-full font-medium">
              {brief.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-espresso text-sm leading-snug mb-3 line-clamp-2">
            {brief.title}
          </h3>

          {/* Budget */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                className="text-lg font-bold text-terracotta leading-none"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {formatIDR(brief.budget_min, true)} – {formatIDR(brief.budget_max, true)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">per konten</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span
              className={cn(
                "flex items-center gap-1",
                urgent && "text-terracotta font-medium"
              )}
            >
              <Clock className="w-3 h-3" />
              {deadlineLabel(brief.deadline)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className={cn(slotsLow && "text-amber-700 font-medium")}>
                {brief.slots_remaining} slot tersisa
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
