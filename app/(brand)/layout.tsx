"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { useBrandStore } from "@/lib/stores/brandStore";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const { currentBrand } = useBrandStore();
  const path = usePathname();
  const t = useT();

  return (
    <div className="min-h-screen bg-bone flex flex-col max-w-lg mx-auto">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-white border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentBrand.logo}</span>
          <div>
            <p className="text-sm font-semibold text-espresso leading-none">{currentBrand.name}</p>
            <p className="text-[10px] text-muted-foreground">Brand dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/campaigns"
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium transition-colors",
              path === "/campaigns" ? "text-espresso" : "text-muted-foreground hover:text-espresso"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.brandNav.campaigns}
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
