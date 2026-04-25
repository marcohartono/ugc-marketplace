"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { APP_NAME, APP_SLOGAN } from "@/lib/config";
import { useT } from "@/lib/useT";
import type { Niche, City, PayoutMethod } from "@/lib/mockData";

const NICHES: Niche[] = ["Fashion", "F&B", "Beauty", "Tech", "Lifestyle", "Gaming", "Edukasi", "Travel"];
const CITIES: City[] = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Lainnya"];
const PAYOUTS: PayoutMethod[] = ["BCA", "Mandiri", "GoPay", "DANA", "OVO", "QRIS"];

function OnboardingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useT();
  const initialRole = params.get("role") === "brand" ? "brand" : null;

  const [role, setRole] = useState<"kreator" | "brand" | null>(
    initialRole === "brand" ? "brand" : null
  );
  const [step, setStep] = useState(initialRole === "brand" ? 1 : 0);
  const [city, setCity] = useState<City | null>(null);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [igHandle, setIgHandle] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [payout, setPayout] = useState<PayoutMethod | null>(null);

  const totalSteps = role === "kreator" ? 4 : 2;

  const canNext = () => {
    if (step === 0) return !!role;
    if (role === "kreator") {
      if (step === 1) return !!city;
      if (step === 2) return niches.length > 0;
      if (step === 3) return !!payout;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && role === "brand") {
      router.push("/campaigns");
      return;
    }
    if (role === "kreator" && step === 3) {
      router.push("/feed");
      return;
    }
    setStep((s) => s + 1);
  };

  const toggleNiche = (n: Niche) =>
    setNiches((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-bone flex flex-col">
      {/* Progress bar */}
      {role && step > 0 && (
        <div className="h-1 bg-bone-dark">
          <motion.div
            className="h-full bg-terracotta"
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={() => (step > 0 ? setStep((s) => s - 1) : router.push("/"))}
          className="p-2 -ml-2 text-muted-foreground hover:text-espresso transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span
            className="text-lg font-bold text-espresso leading-none"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {APP_NAME}
          </span>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{APP_SLOGAN}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Step 0: Role picker */}
            {step === 0 && (
              <div>
                <h1
                  className="text-3xl font-bold text-espresso mb-2"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {t.onboarding.step0Title}
                </h1>
                <p className="text-muted-foreground mb-8">{t.onboarding.step0Sub}</p>
                <div className="space-y-3">
                  {[
                    {
                      id: "kreator",
                      emoji: "🎬",
                      title: t.onboarding.roleCreator,
                      desc: t.onboarding.roleCreatorDesc,
                    },
                    {
                      id: "brand",
                      emoji: "🏷️",
                      title: t.onboarding.roleBrand,
                      desc: t.onboarding.roleBrandDesc,
                    },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id as "kreator" | "brand")}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                        role === r.id
                          ? "border-terracotta bg-terracotta/5"
                          : "border-border bg-white hover:border-terracotta/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{r.emoji}</span>
                        <div>
                          <p className="font-semibold text-espresso">{r.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{r.desc}</p>
                        </div>
                        {role === r.id && (
                          <div className="ml-auto w-6 h-6 bg-terracotta rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: City */}
            {step === 1 && role === "kreator" && (
              <div>
                <h1
                  className="text-3xl font-bold text-espresso mb-2"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {t.onboarding.step1Title}
                </h1>
                <p className="text-muted-foreground mb-8">{t.onboarding.step1Sub}</p>
                <div className="space-y-2">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCity(c)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${
                        city === c
                          ? "border-terracotta bg-terracotta/5 text-terracotta"
                          : "border-border bg-white text-espresso hover:border-terracotta/30"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Niches */}
            {step === 2 && role === "kreator" && (
              <div>
                <h1
                  className="text-3xl font-bold text-espresso mb-2"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {t.onboarding.step2Title}
                </h1>
                <p className="text-muted-foreground mb-8">{t.onboarding.step2Sub}</p>
                <div className="grid grid-cols-2 gap-2">
                  {NICHES.map((n) => (
                    <button
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        niches.includes(n)
                          ? "border-terracotta bg-terracotta/5"
                          : "border-border bg-white hover:border-terracotta/30"
                      }`}
                    >
                      <span className="font-medium text-espresso text-sm">{n}</span>
                      {niches.includes(n) && (
                        <Check className="w-4 h-4 text-terracotta mt-1" />
                      )}
                    </button>
                  ))}
                </div>
                {niches.length > 0 && (
                  <p className="text-sm text-terracotta mt-3 text-center">
                    {t.onboarding.nicheCount(niches.length)}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Social + Payout */}
            {step === 3 && role === "kreator" && (
              <div>
                <h1
                  className="text-3xl font-bold text-espresso mb-2"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {t.onboarding.step3Title}
                </h1>
                <p className="text-muted-foreground mb-6">{t.onboarding.step3Sub}</p>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-sm font-medium text-espresso block mb-1.5">
                      {t.onboarding.igHandle}
                    </label>
                    <div className="flex items-center border-2 border-border rounded-xl bg-white focus-within:border-terracotta transition-colors">
                      <span className="pl-3 text-muted-foreground">@</span>
                      <input
                        type="text"
                        placeholder="username"
                        value={igHandle}
                        onChange={(e) => setIgHandle(e.target.value)}
                        className="flex-1 px-2 py-3 bg-transparent outline-none text-espresso text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-espresso block mb-1.5">
                      {t.onboarding.tiktokHandle}
                    </label>
                    <div className="flex items-center border-2 border-border rounded-xl bg-white focus-within:border-terracotta transition-colors">
                      <span className="pl-3 text-muted-foreground">@</span>
                      <input
                        type="text"
                        placeholder="username"
                        value={tiktokHandle}
                        onChange={(e) => setTiktokHandle(e.target.value)}
                        className="flex-1 px-2 py-3 bg-transparent outline-none text-espresso text-sm"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm font-medium text-espresso mb-3">
                  {t.onboarding.payoutLabel}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYOUTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPayout(p)}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        payout === p
                          ? "border-terracotta bg-terracotta/5 text-terracotta"
                          : "border-border bg-white text-espresso hover:border-terracotta/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 pt-4 max-w-md mx-auto w-full">
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className="w-full flex items-center justify-center gap-2 bg-terracotta text-white py-4 rounded-full font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terracotta-light transition-all active:scale-[0.98]"
        >
          {role === "kreator" && step === 3 ? t.onboarding.ctaFinalCreator : t.onboarding.ctaNext}
          <ArrowRight className="w-4 h-4" />
        </button>
        {step === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            {t.onboarding.freeNote}
          </p>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}
