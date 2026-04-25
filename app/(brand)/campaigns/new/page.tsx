"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus, X, Sparkles } from "lucide-react";
import { useBrandStore } from "@/lib/stores/brandStore";
import { formatIDR } from "@/lib/utils";
import { APP_NAME } from "@/lib/config";
import type { Niche, Brief } from "@/lib/mockData";

const TEMPLATES: Record<string, {
  hook_style: string;
  tone: string;
  description: string;
  must_mention: string[];
  must_avoid: string[];
  emoji: string;
}> = {
  "Review Produk": {
    emoji: "⭐",
    hook_style: "Talking head langsung ke kamera, jujur dan apa adanya",
    tone: "Jujur, informatif, personal. Seperti rekomendasi ke teman.",
    description: "Kami cari kreator yang mau review produk kami dengan jujur. Ceritain pengalaman pertama kali pakai, apa yang kamu suka, dan apa yang bisa lebih baik.",
    must_mention: ["Nama produk dan harganya", "Di mana bisa beli / link pembelian"],
    must_avoid: ["Jangan buat klaim berlebihan", "Jangan sebut kompetitor secara negatif"],
  },
  "Unboxing": {
    emoji: "📦",
    hook_style: "Mulai dari kotak belum dibuka, reveal satu per satu",
    tone: "Excited, autentik, spontan. Reaksi pertama yang natural.",
    description: "Kami mau kreator yang bikin video unboxing produk kami. Tunjukin packaging, isi kotak, dan kesan pertama kamu secara jujur.",
    must_mention: ["Packaging dan presentasi produk", "Semua isi dalam kotak"],
    must_avoid: ["Jangan buka semua sekaligus — build-up dulu", "Jangan skip reaksi awal"],
  },
  "Tutorial Pakai": {
    emoji: "🎯",
    hook_style: "Step-by-step yang jelas, bisa screen recording atau POV",
    tone: "Helpful, jelas, tidak terburu-buru. Edukasi dulu, sell kemudian.",
    description: "Tunjukin cara pakai produk kami step by step. Target audience kami mungkin baru pertama kali dengar produk ini jadi asumsikan mereka pemula.",
    must_mention: ["Langkah-langkah penggunaan secara detail", "Tips dan trik dari pengalaman pribadi"],
    must_avoid: ["Jangan terlalu cepat — penonton harus bisa ikuti", "Jangan skip langkah penting"],
  },
  "Get Ready With Me": {
    emoji: "💄",
    hook_style: "GRWM format, outfit/look reveal di akhir",
    tone: "Stylish, relatable, aspirasional tapi bukan flexing.",
    description: "Bikin video GRWM yang menampilkan produk kami sebagai bagian natural dari rutinitas kamu sehari-hari.",
    must_mention: ["Produk kami saat dipakai", "Cara styling / kombinasi yang kamu pilih"],
    must_avoid: ["Jangan terlalu terlihat seperti iklan — biarkan natural", "Jangan mix dengan brand kompetitor di video yang sama"],
  },
  "Testimoni": {
    emoji: "💬",
    hook_style: "Cerita sebelum dan sesudah, atau narasi perubahan nyata",
    tone: "Sincere, warm, personal. Bukan sales pitch.",
    description: "Ceritain pengalaman nyata kamu menggunakan produk kami. Apa masalah yang diselesaikan dan bagaimana perubahan yang kamu rasakan.",
    must_mention: ["Kondisi sebelum pakai produk kami", "Perubahan yang kamu rasakan setelah pakai"],
    must_avoid: ["Jangan berlebihan — tetap realistis", "Hindari klaim medis atau kesehatan"],
  },
};

const NICHE_BUDGET: Record<string, { min: number; max: number; label: string }> = {
  "F&B":      { min: 300000,  max: 1000000, label: "Rp 300rb – 1jt" },
  Beauty:     { min: 500000,  max: 2000000, label: "Rp 500rb – 2jt" },
  Fashion:    { min: 400000,  max: 1500000, label: "Rp 400rb – 1,5jt" },
  Tech:       { min: 800000,  max: 3000000, label: "Rp 800rb – 3jt" },
  Lifestyle:  { min: 300000,  max: 1200000, label: "Rp 300rb – 1,2jt" },
  Gaming:     { min: 500000,  max: 2000000, label: "Rp 500rb – 2jt" },
  Edukasi:    { min: 400000,  max: 1500000, label: "Rp 400rb – 1,5jt" },
  Travel:     { min: 600000,  max: 2500000, label: "Rp 600rb – 2,5jt" },
};

const NICHES: Niche[] = ["Fashion", "F&B", "Beauty", "Tech", "Lifestyle", "Gaming", "Edukasi", "Travel"];
const PAYOUT_OPTIONS = ["48 jam setelah konten di-approve", "Full payment saat konten di-submit", "50% saat submit, 50% setelah 7 hari performa"];

export default function NewCampaignPage() {
  const router = useRouter();
  const { currentBrand, draft, setDraft, resetDraft, publishBrief } = useBrandStore();

  const [step, setStep] = useState(0);
  const [mentionInput, setMentionInput] = useState("");
  const [avoidInput, setAvoidInput] = useState("");
  const [published, setPublished] = useState(false);

  const totalSteps = 4;

  const selectTemplate = (name: string) => {
    const t = TEMPLATES[name];
    setDraft({
      template: name,
      hook_style: t.hook_style,
      tone: t.tone,
      description: t.description,
      must_mention: [...t.must_mention],
      must_avoid: [...t.must_avoid],
    });
  };

  const selectNiche = (niche: Niche) => {
    const suggestion = NICHE_BUDGET[niche];
    setDraft({
      category: niche,
      budget_min: suggestion?.min ?? 0,
      budget_max: suggestion?.max ?? 0,
    });
  };

  const addMention = () => {
    if (!mentionInput.trim()) return;
    setDraft({ must_mention: [...(draft.must_mention ?? []), mentionInput.trim()] });
    setMentionInput("");
  };

  const removeMention = (i: number) =>
    setDraft({ must_mention: (draft.must_mention ?? []).filter((_, idx) => idx !== i) });

  const addAvoid = () => {
    if (!avoidInput.trim()) return;
    setDraft({ must_avoid: [...(draft.must_avoid ?? []), avoidInput.trim()] });
    setAvoidInput("");
  };

  const removeAvoid = (i: number) =>
    setDraft({ must_avoid: (draft.must_avoid ?? []).filter((_, idx) => idx !== i) });

  const canNext = () => {
    if (step === 0) return !!draft.template;
    if (step === 1) return !!(draft.category && draft.title && draft.description);
    if (step === 2) return !!(draft.budget_min && draft.budget_max && draft.slots_total && draft.deadline);
    return true;
  };

  const handlePublish = () => {
    const newBrief: Brief = {
      id: `brief-new-${Date.now()}`,
      brand_id: currentBrand.id,
      title: draft.title ?? "",
      category: (draft.category ?? "Lifestyle") as Niche,
      description: draft.description ?? "",
      hook_style: draft.hook_style ?? "",
      tone: draft.tone ?? "",
      must_mention: draft.must_mention ?? [],
      must_avoid: draft.must_avoid ?? [],
      deliverables: draft.deliverables ?? "1 video TikTok vertikal 30–60 detik, format 9:16",
      usage_rights: "Brand boleh repost konten di semua platform selama 30 hari",
      payment_terms: draft.payment_terms ?? PAYOUT_OPTIONS[0],
      budget_min: draft.budget_min ?? 0,
      budget_max: draft.budget_max ?? 0,
      slots_total: draft.slots_total ?? 5,
      slots_remaining: draft.slots_total ?? 5,
      deadline: draft.deadline ?? "",
      has_reference_video: false,
      created_at: new Date().toISOString(),
    };
    publishBrief(newBrief);
    setPublished(true);
    setTimeout(() => {
      resetDraft();
      router.push("/campaigns");
    }, 2500);
  };

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="h-1 bg-bone-dark">
        <motion.div
          className="h-full bg-terracotta"
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-white">
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Langkah {step + 1} dari {totalSteps}</p>
          <p className="text-sm font-semibold text-espresso">
            {["Pilih template", "Detail produk", "Budget & jadwal", "Review & publish"][step]}
          </p>
        </div>
        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Step 0: Template */}
            {step === 0 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber" />
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Template brief</p>
                </div>
                <h2
                  className="text-2xl font-bold text-espresso mb-2"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  Konten jenis apa yang kamu butuhkan?
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Template akan pre-fill sebagian besar brief kamu. Kamu bisa edit setelahnya.
                </p>
                <div className="space-y-3">
                  {Object.entries(TEMPLATES).map(([name, t]) => (
                    <button
                      key={name}
                      onClick={() => selectTemplate(name)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        draft.template === name
                          ? "border-terracotta bg-terracotta/5"
                          : "border-border bg-white hover:border-terracotta/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-espresso text-sm">{name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.tone}</p>
                        </div>
                        {draft.template === name && (
                          <div className="w-5 h-5 bg-terracotta rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Product detail */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2
                    className="text-2xl font-bold text-espresso mb-1"
                    style={{ fontFamily: "Fraunces, Georgia, serif" }}
                  >
                    Detail produk & brief
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Sudah pre-filled dari template <strong>{draft.template}</strong>. Edit sesuka kamu.
                  </p>
                </div>

                <Field label="Kategori konten *">
                  <div className="flex flex-wrap gap-2">
                    {NICHES.map((n) => (
                      <button
                        key={n}
                        onClick={() => selectNiche(n)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                          draft.category === n
                            ? "border-terracotta bg-terracotta/5 text-terracotta"
                            : "border-border bg-white text-espresso"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Judul brief *">
                  <input
                    type="text"
                    value={draft.title ?? ""}
                    onChange={(e) => setDraft({ title: e.target.value })}
                    placeholder="Cth: Tunjukin rutinitas pakai produk X selama 7 hari"
                    className="w-full border-2 border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-terracotta transition-colors"
                  />
                </Field>

                <Field label="Deskripsi brief *">
                  <textarea
                    value={draft.description ?? ""}
                    onChange={(e) => setDraft({ description: e.target.value })}
                    rows={4}
                    className="w-full border-2 border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-terracotta transition-colors resize-none"
                  />
                </Field>

                <Field label="Hook style">
                  <input
                    type="text"
                    value={draft.hook_style ?? ""}
                    onChange={(e) => setDraft({ hook_style: e.target.value })}
                    className="w-full border-2 border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-terracotta transition-colors"
                  />
                </Field>

                <Field label="Yang harus disebutkan">
                  <div className="space-y-2 mb-2">
                    {(draft.must_mention ?? []).map((m, i) => (
                      <div key={i} className="flex items-center gap-2 bg-bone-dark px-3 py-2 rounded-xl">
                        <span className="text-[#25D366] text-sm">✓</span>
                        <p className="text-sm text-espresso flex-1">{m}</p>
                        <button onClick={() => removeMention(i)}>
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mentionInput}
                      onChange={(e) => setMentionInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addMention()}
                      placeholder="Tambah poin..."
                      className="flex-1 border-2 border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
                    />
                    <button
                      onClick={addMention}
                      className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </Field>

                <Field label="Yang harus dihindari">
                  <div className="space-y-2 mb-2">
                    {(draft.must_avoid ?? []).map((m, i) => (
                      <div key={i} className="flex items-center gap-2 bg-bone-dark px-3 py-2 rounded-xl">
                        <span className="text-terracotta text-sm">✕</span>
                        <p className="text-sm text-espresso flex-1">{m}</p>
                        <button onClick={() => removeAvoid(i)}>
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={avoidInput}
                      onChange={(e) => setAvoidInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addAvoid()}
                      placeholder="Tambah larangan..."
                      className="flex-1 border-2 border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
                    />
                    <button
                      onClick={addAvoid}
                      className="w-10 h-10 bg-bone-dark border-2 border-border rounded-xl flex items-center justify-center text-espresso"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </Field>
              </div>
            )}

            {/* Step 2: Budget & schedule */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2
                    className="text-2xl font-bold text-espresso mb-1"
                    style={{ fontFamily: "Fraunces, Georgia, serif" }}
                  >
                    Budget & jadwal
                  </h2>
                  {draft.category && NICHE_BUDGET[draft.category] && (
                    <div className="flex items-center gap-2 mt-2 mb-5 bg-amber/15 rounded-xl px-3 py-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <p className="text-xs text-amber-800">
                        Rekomendasi untuk kategori <strong>{draft.category}</strong>: {NICHE_BUDGET[draft.category].label}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Budget minimum (Rp)">
                    <input
                      type="number"
                      value={draft.budget_min || ""}
                      onChange={(e) => setDraft({ budget_min: Number(e.target.value) })}
                      placeholder="500000"
                      className="w-full border-2 border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-terracotta transition-colors"
                    />
                  </Field>
                  <Field label="Budget maksimum (Rp)">
                    <input
                      type="number"
                      value={draft.budget_max || ""}
                      onChange={(e) => setDraft({ budget_max: Number(e.target.value) })}
                      placeholder="1500000"
                      className="w-full border-2 border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-terracotta transition-colors"
                    />
                  </Field>
                </div>

                {(draft.budget_min ?? 0) > 0 && (draft.budget_max ?? 0) > 0 && (
                  <div className="bg-bone-dark rounded-xl px-4 py-3 text-sm text-espresso">
                    Range budget kamu:{" "}
                    <strong>{formatIDR(draft.budget_min ?? 0, true)} – {formatIDR(draft.budget_max ?? 0, true)}</strong>
                  </div>
                )}

                <Field label="Jumlah slot kreator *">
                  <div className="flex gap-2">
                    {[3, 5, 10, 15, 20].map((n) => (
                      <button
                        key={n}
                        onClick={() => setDraft({ slots_total: n })}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                          draft.slots_total === n
                            ? "border-terracotta bg-terracotta/5 text-terracotta"
                            : "border-border bg-white text-espresso"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Deadline *">
                  <input
                    type="date"
                    value={draft.deadline ?? ""}
                    onChange={(e) => setDraft({ deadline: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border-2 border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-terracotta transition-colors"
                  />
                </Field>

                <Field label="Syarat pembayaran ke kreator">
                  <div className="space-y-2">
                    {PAYOUT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setDraft({ payment_terms: opt })}
                        className={`w-full text-left text-xs px-3 py-3 rounded-xl border-2 transition-all ${
                          draft.payment_terms === opt
                            ? "border-terracotta bg-terracotta/5 text-terracotta"
                            : "border-border bg-white text-espresso"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && !published && (
              <div>
                <h2
                  className="text-2xl font-bold text-espresso mb-5"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  Review brief kamu
                </h2>

                <div className="space-y-4">
                  <ReviewRow label="Template" value={draft.template ?? ""} />
                  <ReviewRow label="Kategori" value={draft.category ?? ""} />
                  <ReviewRow label="Judul" value={draft.title ?? ""} />
                  <ReviewRow label="Deskripsi" value={draft.description ?? ""} />

                  <div className="bg-terracotta/10 rounded-2xl px-4 py-4">
                    <p className="text-xs text-muted-foreground mb-1">Budget per konten</p>
                    <p
                      className="text-2xl font-bold text-terracotta"
                      style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                      {formatIDR(draft.budget_min ?? 0, true)} – {formatIDR(draft.budget_max ?? 0, true)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-bone-dark rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">Slot kreator</p>
                      <p className="text-lg font-bold text-espresso">{draft.slots_total}</p>
                    </div>
                    <div className="bg-bone-dark rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-bold text-espresso">
                        {draft.deadline ? new Date(draft.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "–"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-border rounded-2xl p-4">
                    <p className="text-xs font-semibold text-espresso mb-2">Yang harus disebutkan</p>
                    {(draft.must_mention ?? []).map((m) => (
                      <p key={m} className="text-xs text-muted-foreground flex gap-1.5 mb-1">
                        <span className="text-[#25D366]">✓</span> {m}
                      </p>
                    ))}
                  </div>

                  <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-espresso mb-1">💚 Escrow otomatis aktif</p>
                    <p className="text-xs text-muted-foreground">
                      Setelah brief dipublish, dana kamu akan ditahan aman oleh {APP_NAME} sampai konten disetujui.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Published state */}
            {published && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-20 h-20 bg-[#25D366]/15 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <h2
                  className="text-2xl font-bold text-espresso mb-2"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  Brief dipublish!
                </h2>
                <p className="text-muted-foreground text-sm">
                  Brief kamu sekarang bisa dilihat oleh kreator. Kita kabarin kamu begitu ada yang apply.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Mengalihkan ke campaigns...</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      {!published && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 pb-8 pt-3 bg-gradient-to-t from-bone via-bone to-transparent">
          <button
            onClick={step < 3 ? () => setStep(s => s + 1) : handlePublish}
            disabled={!canNext()}
            className="w-full flex items-center justify-center gap-2 bg-terracotta text-white py-4 rounded-full font-semibold disabled:opacity-40 transition-all active:scale-[0.98] hover:bg-terracotta-light"
          >
            {step === 3 ? "Publish brief" : "Lanjut"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-espresso block mb-2">{label}</label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-3">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm text-espresso">{value || "–"}</p>
    </div>
  );
}
