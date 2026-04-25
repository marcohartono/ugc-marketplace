"use client";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Banknote, ArrowRight, Shield } from "lucide-react";
import { useUserStore } from "@/lib/stores/userStore";
import { useAppStore } from "@/lib/stores/appStore";
import { brands } from "@/lib/mockData";
import { formatIDR, relativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  const { currentUser } = useUserStore();
  const { transactions, jobs } = useAppStore();

  const myTxns = transactions.filter((t) => t.creator_id === currentUser.id);

  const monthlyPaid = myTxns
    .filter((t) => t.status === "Dibayarkan" && t.created_at.startsWith("2026-04"))
    .reduce((sum, t) => sum + t.amount, 0);

  const inEscrow = myTxns
    .filter((t) => t.status === "Dalam escrow")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaid = myTxns
    .filter((t) => t.status === "Dibayarkan")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-espresso px-5 pt-14 pb-8">
        <p className="text-bone/60 text-sm mb-1">Pendapatanmu bulan ini</p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-bone"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          {formatIDR(monthlyPaid + inEscrow)}
        </motion.p>
        <p className="text-bone/50 text-xs mt-2">
          Termasuk {formatIDR(inEscrow, true)} dalam escrow
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "Dalam escrow", value: formatIDR(inEscrow, true), icon: <Shield className="w-4 h-4" />, color: "text-[#25D366]" },
            { label: "Sudah cair", value: formatIDR(totalPaid, true), icon: <Banknote className="w-4 h-4" />, color: "text-amber" },
            { label: "Total gig", value: `${myTxns.length}`, icon: <TrendingUp className="w-4 h-4" />, color: "text-bone" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-2xl p-3 text-center">
              <p className={cn("flex justify-center mb-1", stat.color)}>{stat.icon}</p>
              <p className="text-bone text-base font-bold" style={{ fontFamily: "Fraunces, Georgia, serif" }}>{stat.value}</p>
              <p className="text-bone/50 text-[10px] mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payout method */}
      <div className="px-5 py-4 bg-white border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Rekening terdaftar</p>
            <p className="text-sm font-semibold text-espresso">{currentUser.payout_account}</p>
          </div>
          <button className="flex items-center gap-1 text-xs text-terracotta font-medium">
            Ubah <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-espresso"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Riwayat transaksi
          </h2>
        </div>

        {myTxns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">💸</p>
            <p className="text-muted-foreground text-sm">Belum ada transaksi nih.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTxns.map((txn, i) => {
              const isEscrow = txn.status === "Dalam escrow";
              const isPaid = txn.status === "Dibayarkan";
              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        isEscrow ? "bg-amber/20" : "bg-[#25D366]/15"
                      )}
                    >
                      {isEscrow ? (
                        <Shield className="w-5 h-5 text-amber-700" />
                      ) : (
                        <Banknote className="w-5 h-5 text-[#25D366]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-espresso truncate">
                        {txn.brief_title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{txn.brand_name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={cn(
                            "text-xs font-medium px-2.5 py-1 rounded-full",
                            isEscrow && "bg-amber/20 text-amber-700",
                            isPaid && "bg-[#25D366]/15 text-[#1DA851]"
                          )}
                        >
                          {isEscrow ? "Dalam escrow" : "Dibayarkan ✓"}
                        </span>
                        <p
                          className={cn(
                            "text-base font-bold",
                            isPaid ? "text-[#1DA851]" : "text-espresso"
                          )}
                          style={{ fontFamily: "Fraunces, Georgia, serif" }}
                        >
                          {formatIDR(txn.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {relativeDate(txn.created_at)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Reassurance note */}
        <div className="mt-5 mb-8 bg-bone-dark rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            💚 Dana dalam escrow aman & terlindungi oleh KONTENIN. Dicairkan otomatis
            dalam 48 jam setelah konten disetujui brand.
          </p>
        </div>
      </div>
    </div>
  );
}
