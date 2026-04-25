"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/userStore";
import { useBrandStore } from "@/lib/stores/brandStore";
import { useAppStore } from "@/lib/stores/appStore";
import { creators, brands } from "@/lib/mockData";
import { X, Terminal } from "lucide-react";

export function DevDrawer() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  const { currentBrand, setCurrentBrand } = useBrandStore();
  const { updateJobContentStatus, updateJobEscrowStatus } = useAppStore();

  const go = (path: string) => { router.push(path); setOpen(false); };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-50 bg-espresso text-bone text-xs font-mono px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-espresso-light transition-colors"
      >
        <Terminal className="w-3 h-3" />
        DEV
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-espresso text-bone p-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span className="font-mono text-sm font-semibold">DEV PANEL</span>
                </div>
                <button onClick={() => setOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick nav */}
              <section className="mb-6">
                <p className="text-xs uppercase tracking-widest text-bone/50 mb-3">Quick nav</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Landing", path: "/" },
                    { label: "Onboarding", path: "/onboarding" },
                    { label: "Feed", path: "/feed" },
                    { label: "Brief 1", path: "/brief/brief-1" },
                    { label: "Pitches", path: "/applications" },
                    { label: "Gig aktif", path: "/jobs/job-1" },
                    { label: "Wallet", path: "/wallet" },
                    { label: "Profil", path: "/profile" },
                    { label: "Campaigns", path: "/campaigns" },
                    { label: "Campaign 2", path: "/campaigns/brief-2" },
                    { label: "Pelamar 1", path: "/applicants/app-1" },
                  ].map((n) => (
                    <button
                      key={n.path}
                      onClick={() => go(n.path)}
                      className="text-left px-2 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Creator user */}
              <section className="mb-6">
                <p className="text-xs uppercase tracking-widest text-bone/50 mb-3">Demo Kreator</p>
                <div className="space-y-1.5">
                  {creators.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setCurrentUser(c.id); setOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        currentUser.id === c.id ? "bg-terracotta text-white" : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {c.avatar} {c.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Brand user */}
              <section className="mb-6">
                <p className="text-xs uppercase tracking-widest text-bone/50 mb-3">Demo Brand</p>
                <div className="space-y-1.5">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setCurrentBrand(b.id); go("/campaigns"); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        currentBrand.id === b.id ? "bg-terracotta text-white" : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {b.logo} {b.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Job simulation */}
              <section className="mb-6">
                <p className="text-xs uppercase tracking-widest text-bone/50 mb-3">Simulasi konten</p>
                <div className="space-y-1.5">
                  {(["Belum upload", "Dikirim", "Review brand", "Revisi diminta", "Disetujui"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateJobContentStatus("job-1", s)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-xs uppercase tracking-widest text-bone/50 mb-3">Simulasi escrow</p>
                <div className="space-y-1.5">
                  {(["Dana masuk escrow", "Konten disetujui", "Dicairkan"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateJobEscrowStatus("job-1", s)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
