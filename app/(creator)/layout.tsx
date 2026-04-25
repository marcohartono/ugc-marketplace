"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const t = useT();

  const NAV = [
    { href: "/feed", icon: Home, label: t.nav.feed },
    { href: "/applications", icon: FileText, label: t.nav.pitches },
    { href: "/wallet", icon: Wallet, label: t.nav.wallet },
    { href: "/profile", icon: User, label: t.nav.profile },
  ];

  return (
    <div className="min-h-screen bg-bone flex flex-col max-w-lg mx-auto">
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-sm border-t border-border px-2 py-2 z-40">
        <div className="flex justify-around">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors",
                  active ? "text-terracotta" : "text-muted-foreground hover:text-espresso"
                )}
              >
                <Icon className={cn("w-5 h-5", active && "fill-terracotta/10")} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
