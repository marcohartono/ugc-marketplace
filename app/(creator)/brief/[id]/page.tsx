"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  Shield,
  ChevronDown,
  Send,
  Lightbulb,
  X,
} from "lucide-react";
import { briefs, brands } from "@/lib/mockData";
import { useAppStore } from "@/lib/stores/appStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useBrandStore } from "@/lib/stores/brandStore";
import { formatIDR, deadlineLabel, isUrgent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { WhatsAppToast, useWAToast } from "@/components/shared/WhatsAppToast";

const PITCH_EXAMPLES = [
  "Konten aku biasanya perform bagus di niche ini karena audience aku emang target market yang tepat.",
  "Aku punya pengalaman bikin konten serupa yang dapet 100k+ views organik — bisa aku share contohnya.",
  "Aku relate banget sama produk ini karena emang udah pakai sendiri. Jadi bisa bikin konten yang genuine.",
];

export default function BriefDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { applications, addApplication, pushNotification } = useAppStore();
  const { publishedBriefs } = useBrandStore();
  const waToast = useWAToast();

  const brief = [...publishedBriefs, ...briefs].find((b) => b.id === id);
  const brand = brief ? brands.find((b) => b.id === brief.brand_id) : null;

  const [applyOpen, setApplyOpen] = useState(false);
  const [pitch, setPitch] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const alreadyApplied = applications.some(
    (a) => a.brief_id === id && a.creator_id === currentUser.id
  );

  if (!brief || !brand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Brief tidak ditemukan.</p>
      </div>
    );
  }

  const urgent = isUrgent(brief.deadline);

  const handleSubmit = () => {
    if (!pitch.trim()) return;
    const newApp = {
      id: `app-${Date.now()}`,
      creator_id: currentUser.id,
      brief_id: brief.id,
      pitch: pitch.trim(),
      portfolio_link: portfolio || undefined,
      status: "Menunggu review" as const,
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addApplication(newApp);
    pushNotification({
      type: "wa",
      title: "Pitch terkirim!",
      body: `Pitch kamu untuk "${brief.title}" udah dikirim ke ${brand.name}.`,
    });
    setSubmitted(true);
    waToast.trigger(
      `Hei! Pitch kamu untuk brief "${brief.title}" dari ${brand.name} sudah kami terima. Kami akan kabarin kamu lewat WA kalau mereka tertarik ya 🎉`
    );
  };

  return (
    <>
      <WhatsAppToast
        show={waToast.show}
        message={waToast.message}
        onClose={waToast.close}
        phone={currentUser.phone}
      />

      <div className="min-h-screen pb-28">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-bone/95 backdrop-blur-sm border-b border-border px-5 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-espresso truncate">{brand.name}</p>
          </div>
        </div>

        <div className="px-5 pt-5">
          {/* Brand info */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-bone-dark rounded-xl flex items-center justify-center text-2xl">
              {brand.logo}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-espresso">{brand.name}</p>
                {brand.verified && (
                  <span className="text-xs text-[#25D366] font-medium">✓ Verified</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{brand.category} · {brand.city}</p>
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-2xl font-bold text-espresso leading-snug mb-4"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {brief.title}
          </h1>

          {/* Budget badge */}
          <div className="bg-terracotta/10 rounded-2xl px-5 py-4 mb-5">
            <p className="text-xs text-muted-foreground mb-1">Budget per konten</p>
            <p
              className="text-3xl font-bold text-terracotta"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {formatIDR(brief.budget_min, true)} – {formatIDR(brief.budget_max, true)}
            </p>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium",
                urgent
                  ? "bg-terracotta/15 text-terracotta"
                  : "bg-bone-dark text-espresso"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              Deadline: {deadlineLabel(brief.deadline)}
            </span>
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-bone-dark text-espresso font-medium">
              <Users className="w-3.5 h-3.5" />
              {brief.slots_remaining} dari {brief.slots_total} slot tersisa
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-bone-dark text-espresso font-medium">
              {brief.category}
            </span>
          </div>

          {/* Description */}
          <Section title="Tentang brief ini">
            <p className="text-sm text-muted-foreground leading-relaxed">{brief.description}</p>
          </Section>

          {/* Hook & Tone */}
          <Section title="Gaya & Tone">
            <InfoRow label="Hook style" value={brief.hook_style} />
            <InfoRow label="Tone" value={brief.tone} />
          </Section>

          {/* Must mention */}
          <Section title="Yang harus disebutin">
            <ul className="space-y-2">
              {brief.must_mention.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm text-espresso">
                  <span className="text-[#25D366] mt-0.5">✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </Section>

          {/* Must avoid */}
          <Section title="Yang harus dihindari">
            <ul className="space-y-2">
              {brief.must_avoid.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-terracotta mt-0.5">✕</span>
                  {m}
                </li>
              ))}
            </ul>
          </Section>

          {/* Deliverables */}
          <Section title="Deliverable">
            <p className="text-sm text-espresso">{brief.deliverables}</p>
          </Section>

          {/* Payment terms */}
          <div className="bg-[#25D366]/10 rounded-2xl p-4 mb-5 border border-[#25D366]/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#25D366]" />
              <p className="text-sm font-semibold text-espresso">Syarat Pembayaran</p>
            </div>
            <p className="text-sm text-muted-foreground">{brief.payment_terms}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Dana ditahan di escrow KONTENIN sebelum kamu mulai. Kamu aman.
            </p>
          </div>

          {/* Usage rights */}
          <Section title="Hak Penggunaan Konten">
            <p className="text-sm text-muted-foreground">{brief.usage_rights}</p>
          </Section>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 pb-3 pt-2 bg-gradient-to-t from-bone via-bone to-transparent z-20">
        <button
          onClick={() => !alreadyApplied && setApplyOpen(true)}
          disabled={alreadyApplied || brief.slots_remaining === 0}
          className={cn(
            "w-full py-4 rounded-full font-semibold text-base transition-all active:scale-[0.98]",
            alreadyApplied
              ? "bg-bone-dark text-muted-foreground cursor-default"
              : brief.slots_remaining === 0
              ? "bg-bone-dark text-muted-foreground cursor-not-allowed"
              : "bg-terracotta text-white hover:bg-terracotta-light hover:shadow-lg hover:shadow-terracotta/20"
          )}
        >
          {alreadyApplied
            ? "Sudah diajukan ✓"
            : brief.slots_remaining === 0
            ? "Slot penuh"
            : "Ajukan Diri"}
        </button>
      </div>

      {/* Apply sheet */}
      <AnimatePresence>
        {applyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => !submitted && setApplyOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-t-3xl z-50 p-5 pb-10"
            >
              {submitted ? (
                <ApplySuccess briefTitle={brief.title} brandName={brand.name} onClose={() => { setApplyOpen(false); router.push("/applications"); }} />
              ) : (
                <ApplyForm
                  pitch={pitch}
                  setPitch={setPitch}
                  portfolio={portfolio}
                  setPortfolio={setPortfolio}
                  showExamples={showExamples}
                  setShowExamples={setShowExamples}
                  onSubmit={handleSubmit}
                  onClose={() => setApplyOpen(false)}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3
        className="text-sm font-semibold text-espresso mb-2"
        style={{ fontFamily: "Fraunces, Georgia, serif" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-espresso">{value}</p>
    </div>
  );
}

function ApplyForm({
  pitch, setPitch, portfolio, setPortfolio,
  showExamples, setShowExamples, onSubmit, onClose,
}: {
  pitch: string; setPitch: (v: string) => void;
  portfolio: string; setPortfolio: (v: string) => void;
  showExamples: boolean; setShowExamples: (v: boolean) => void;
  onSubmit: () => void; onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-bold text-espresso"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          Ajukan diri
        </h2>
        <button onClick={onClose} className="text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-espresso">
            Kenapa kamu yang tepat?
          </label>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1 text-xs text-terracotta"
          >
            <Lightbulb className="w-3 h-3" />
            Butuh inspirasi?
          </button>
        </div>
        <textarea
          value={pitch}
          onChange={(e) => setPitch(e.target.value.slice(0, 200))}
          placeholder="Ceritain singkat kenapa konten kamu cocok buat brand ini..."
          className="w-full border-2 border-border rounded-xl p-3 text-sm text-espresso placeholder:text-muted-foreground resize-none outline-none focus:border-terracotta transition-colors"
          rows={4}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Singkat & to the point</span>
          <span className={`text-xs ${pitch.length >= 190 ? "text-terracotta" : "text-muted-foreground"}`}>
            {pitch.length}/200
          </span>
        </div>

        {showExamples && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-2"
          >
            {PITCH_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setPitch(ex); setShowExamples(false); }}
                className="w-full text-left text-xs bg-bone p-3 rounded-xl border border-border text-muted-foreground hover:border-terracotta/40 transition-colors"
              >
                "{ex}"
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-espresso block mb-1.5">
          Link portfolio / konten serupa <span className="text-muted-foreground font-normal">(opsional)</span>
        </label>
        <input
          type="url"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="https://tiktok.com/@kamu/video/..."
          className="w-full border-2 border-border rounded-xl px-3 py-3 text-sm text-espresso placeholder:text-muted-foreground outline-none focus:border-terracotta transition-colors"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!pitch.trim()}
        className="w-full flex items-center justify-center gap-2 bg-terracotta text-white py-4 rounded-full font-semibold disabled:opacity-40 transition-all active:scale-[0.98]"
      >
        <Send className="w-4 h-4" />
        Kirim pitch
      </button>
    </>
  );
}

function ApplySuccess({ briefTitle, brandName, onClose }: { briefTitle: string; brandName: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="w-16 h-16 bg-[#25D366]/15 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <span className="text-3xl">🎉</span>
      </motion.div>
      <h2
        className="text-2xl font-bold text-espresso mb-2"
        style={{ fontFamily: "Fraunces, Georgia, serif" }}
      >
        Pitch terkirim!
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-2">
        Pitch kamu untuk <strong>{briefTitle}</strong> udah dikirim ke {brandName}.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Kami akan kabarin kamu lewat WhatsApp kalau mereka tertarik 👇
      </p>

      {/* Fake WA preview */}
      <div className="bg-[#ECE5DD] rounded-2xl p-3 mb-6 text-left">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
          <span className="text-xs font-medium text-[#111B21]">KONTENIN</span>
        </div>
        <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm">
          <p className="text-xs text-[#111B21] leading-relaxed">
            Hei! Pitch kamu untuk brief dari {brandName} sudah kami terusin ke mereka. Biasanya brand response dalam 1–3 hari kerja 🙌
          </p>
          <p className="text-[10px] text-[#8696A0] text-right mt-1">Baru saja ✓✓</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-espresso text-bone py-4 rounded-full font-semibold"
      >
        Lihat semua pitches
      </button>
    </motion.div>
  );
}
