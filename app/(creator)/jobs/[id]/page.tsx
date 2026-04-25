"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, MessageCircle, CreditCard, FileText, Send, CheckCircle2, RotateCcw, Edit3 } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";
import { useUserStore } from "@/lib/stores/userStore";
import { briefs, brands } from "@/lib/mockData";
import { formatIDR, relativeDate } from "@/lib/utils";
import { EscrowBadge } from "@/components/shared/EscrowBadge";
import { WhatsAppToast, useWAToast } from "@/components/shared/WhatsAppToast";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/mockData";

const CONTENT_STATUS_STEPS: ContentStatus[] = [
  "Belum upload",
  "Dikirim",
  "Review brand",
  "Revisi diminta",
  "Disetujui",
];

const STATUS_LABELS: Record<ContentStatus, { label: string; color: string }> = {
  "Belum upload": { label: "Belum upload", color: "text-muted-foreground" },
  Dikirim: { label: "Dikirim ke brand ✓", color: "text-amber-700" },
  "Review brand": { label: "Brand lagi review...", color: "text-amber-700" },
  "Revisi diminta": { label: "Revisi diminta ✏️", color: "text-terracotta" },
  Disetujui: { label: "Disetujui! 🎉", color: "text-[#1DA851]" },
};

type TabKey = "brief" | "upload" | "chat" | "pembayaran";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { jobs, updateJobContentStatus, updateJobEscrowStatus, addJobMessage } = useAppStore();
  const waToast = useWAToast();

  const [activeTab, setActiveTab] = useState<TabKey>("brief");
  const [chatInput, setChatInput] = useState("");
  const [uploadDone, setUploadDone] = useState(false);
  const [fakeFiles, setFakeFiles] = useState<string[]>([]);

  const job = jobs.find((j) => j.id === id);
  const brief = job ? briefs.find((b) => b.id === job.brief_id) : null;
  const brand = job ? brands.find((b) => b.id === job.brand_id) : null;

  if (!job || !brief || !brand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Gig tidak ditemukan.</p>
      </div>
    );
  }

  const handleUpload = () => {
    const names = ["video_take1.mp4", "video_take2_final.mp4"];
    setFakeFiles(names);
    setUploadDone(true);
    updateJobContentStatus(job.id, "Dikirim");
    setTimeout(() => {
      updateJobContentStatus(job.id, "Review brand");
      waToast.trigger("Konten kamu udah kami terusin ke Glow.id untuk direview. Biasanya 24–48 jam ya! 🙌");
    }, 2000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    addJobMessage(job.id, chatInput);
    setChatInput("");
  };

  const handleEscrowNext = () => {
    if (job.escrow_status === "Dana masuk escrow") {
      updateJobEscrowStatus(job.id, "Konten disetujui");
    } else if (job.escrow_status === "Konten disetujui") {
      updateJobEscrowStatus(job.id, "Dicairkan");
      waToast.trigger(
        `Dana ${formatIDR(job.amount_net)} sudah dicairkan ke rekening kamu (${currentUser.payout_account})! 💚`
      );
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "brief", label: "Brief", icon: <FileText className="w-4 h-4" /> },
    { key: "upload", label: "Upload", icon: <Upload className="w-4 h-4" /> },
    { key: "chat", label: "Chat", icon: <MessageCircle className="w-4 h-4" /> },
    { key: "pembayaran", label: "Bayar", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <>
      <WhatsAppToast
        show={waToast.show}
        message={waToast.message}
        onClose={waToast.close}
        phone={currentUser.phone}
      />

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-bone/95 backdrop-blur-sm border-b border-border px-5 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{brand.logo}</span>
            <div>
              <p className="text-sm font-semibold text-espresso leading-none">{brand.name}</p>
              <p className="text-xs text-muted-foreground">{STATUS_LABELS[job.content_status].label}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-white px-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.key
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 px-5 pt-5 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* Brief tab */}
              {activeTab === "brief" && (
                <div className="space-y-5">
                  <div>
                    <h2
                      className="text-xl font-bold text-espresso mb-1"
                      style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                      {brief.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{brief.description}</p>
                  </div>
                  <div className="bg-bone-dark rounded-2xl p-4 space-y-3">
                    <Row label="Deliverable" value={brief.deliverables} />
                    <Row label="Deadline" value={new Date(brief.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
                    <Row label="Hak penggunaan" value={brief.usage_rights} />
                    <Row label="Syarat bayar" value={brief.payment_terms} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-espresso mb-2">Yang harus disebutin</p>
                    {brief.must_mention.map((m) => (
                      <p key={m} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-[#25D366]">✓</span> {m}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload tab */}
              {activeTab === "upload" && (
                <div className="space-y-5">
                  {/* Status tracker */}
                  <div className="bg-white border border-border rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                      Status konten
                    </p>
                    <div className="flex items-center gap-2">
                      {["Dikirim", "Review brand", "Disetujui"].map((s, i) => {
                        const currentIdx = CONTENT_STATUS_STEPS.indexOf(job.content_status);
                        const stepIdx = CONTENT_STATUS_STEPS.indexOf(s as ContentStatus);
                        const done = stepIdx < currentIdx;
                        const active = s === job.content_status;
                        return (
                          <div key={s} className="flex items-center gap-2 flex-1 min-w-0">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold",
                              done && "bg-[#25D366] text-white",
                              active && "bg-terracotta text-white",
                              !done && !active && "bg-bone-dark text-muted-foreground"
                            )}>
                              {done ? "✓" : i + 1}
                            </div>
                            <p className={cn("text-xs truncate", active && "font-medium text-espresso", !active && "text-muted-foreground")}>
                              {s}
                            </p>
                            {i < 2 && <div className="w-px h-4 bg-border flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    {job.content_status === "Revisi diminta" && (
                      <div className="mt-3 bg-terracotta/10 rounded-xl p-3">
                        <p className="text-xs font-medium text-terracotta flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" /> Revisi diminta oleh brand
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          "Bisa tambahkan close-up produk di menit ke-1? Sisanya sudah bagus!"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upload area */}
                  {job.content_status === "Belum upload" || job.content_status === "Revisi diminta" ? (
                    <div>
                      {fakeFiles.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {fakeFiles.map((f) => (
                            <div key={f} className="flex items-center gap-3 bg-white border border-border rounded-xl p-3">
                              <div className="w-8 h-8 bg-bone-dark rounded-lg flex items-center justify-center text-sm">🎬</div>
                              <p className="text-sm text-espresso flex-1">{f}</p>
                              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => setFakeFiles(["video_rough_cut.mp4"])}
                          className="w-full border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-terracotta/40 transition-colors mb-4"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium text-espresso">Tap untuk upload video</p>
                          <p className="text-xs text-muted-foreground mt-1">MP4, MOV · Maks 500MB per file</p>
                        </button>
                      )}

                      {fakeFiles.length > 0 && (
                        <div className="mb-4">
                          <label className="text-sm font-medium text-espresso block mb-1.5">
                            Caption / catatan ke brand <span className="text-muted-foreground font-normal">(opsional)</span>
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Misal: 'Untuk take ke-2, aku coba angle yang berbeda...'"
                            className="w-full border-2 border-border rounded-xl p-3 text-sm outline-none focus:border-terracotta transition-colors resize-none"
                          />
                        </div>
                      )}

                      <button
                        onClick={handleUpload}
                        disabled={fakeFiles.length === 0}
                        className="w-full bg-terracotta text-white py-4 rounded-full font-semibold disabled:opacity-40 transition-all active:scale-[0.98]"
                      >
                        Submit untuk review
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {job.content_status === "Disetujui" ? (
                        <>
                          <div className="w-16 h-16 bg-[#25D366]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🎉</span>
                          </div>
                          <p className="font-semibold text-espresso mb-1">Konten disetujui!</p>
                          <p className="text-sm text-muted-foreground">Dana akan segera cair ke rekening kamu.</p>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RotateCcw className="w-6 h-6 text-amber-700" />
                          </div>
                          <p className="font-semibold text-espresso mb-1">Konten sedang direview</p>
                          <p className="text-sm text-muted-foreground">Brand biasanya response dalam 24–48 jam.</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Chat tab */}
              {activeTab === "chat" && (
                <div className="flex flex-col" style={{ height: "calc(100vh - 260px)" }}>
                  {/* WA banner */}
                  <div className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl px-3 py-2.5 mb-4 flex-shrink-0">
                    <span className="text-[#25D366] text-sm">💬</span>
                    <p className="text-xs text-espresso">
                      Chat penting otomatis dikirim ke WA kamu di{" "}
                      <strong>{currentUser.phone}</strong>
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {job.messages.map((msg) => {
                      const isMe = msg.sender === "creator";
                      return (
                        <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[80%] px-3 py-2.5 rounded-2xl",
                            isMe
                              ? "bg-terracotta text-white rounded-br-sm"
                              : "bg-white border border-border text-espresso rounded-bl-sm"
                          )}>
                            {!isMe && (
                              <p className="text-[10px] font-semibold mb-1 opacity-70">{msg.sender_name}</p>
                            )}
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className={cn("text-[10px] text-right mt-1", isMe ? "text-white/60" : "text-muted-foreground")}>
                              {new Date(msg.sent_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input */}
                  <div className="flex items-end gap-2 flex-shrink-0">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChat();
                        }
                      }}
                      rows={1}
                      placeholder="Ketik pesan..."
                      className="flex-1 border-2 border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-terracotta transition-colors resize-none"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={!chatInput.trim()}
                      className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Pembayaran tab */}
              {activeTab === "pembayaran" && (
                <div className="space-y-5">
                  {/* Amount display */}
                  <div className="bg-white border border-border rounded-2xl p-5">
                    <p className="text-xs text-muted-foreground mb-2">Total pendapatanmu</p>
                    <p
                      className="text-4xl font-bold text-espresso mb-1"
                      style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                      {formatIDR(job.amount_net)}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Gross {formatIDR(job.amount_gross)}</span>
                      <span>·</span>
                      <span>Platform fee 10% = {formatIDR(job.platform_fee)}</span>
                    </div>

                    {job.escrow_status === "Dicairkan" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 bg-[#25D366]/10 rounded-xl p-3 border border-[#25D366]/20"
                      >
                        <p className="text-sm font-semibold text-[#1DA851] text-center">
                          💚 Dana sudah cair ke {currentUser.payout_account}!
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Escrow tracker */}
                  <div className="bg-white border border-border rounded-2xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                      Status escrow
                    </p>
                    <EscrowBadge
                      status={job.escrow_status}
                      account={currentUser.payout_account}
                    />
                  </div>

                  {/* Payout account */}
                  <div className="bg-bone-dark rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Rekening tujuan</p>
                    <p className="text-sm font-semibold text-espresso">{currentUser.payout_account}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Dicairkan dalam 48 jam setelah konten disetujui
                    </p>
                  </div>

                  {/* Demo advance escrow button */}
                  {job.escrow_status !== "Dicairkan" && (
                    <button
                      onClick={handleEscrowNext}
                      className="w-full border-2 border-dashed border-border py-3 rounded-xl text-sm text-muted-foreground hover:border-terracotta/40 hover:text-terracotta transition-colors"
                    >
                      [Demo] Maju ke tahap escrow berikutnya →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-espresso">{value}</p>
    </div>
  );
}
