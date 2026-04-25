import { cn } from "@/lib/utils";
import { EscrowStatus } from "@/lib/mockData";
import { Shield, CheckCircle2, Banknote } from "lucide-react";

const steps: { status: EscrowStatus; label: string; icon: React.ReactNode }[] = [
  { status: "Dana masuk escrow", label: "Dana ditahan aman", icon: <Shield className="w-4 h-4" /> },
  { status: "Konten disetujui", label: "Konten disetujui", icon: <CheckCircle2 className="w-4 h-4" /> },
  { status: "Dicairkan", label: "Dicairkan ke rekeningmu", icon: <Banknote className="w-4 h-4" /> },
];

const statusIndex: Record<EscrowStatus, number> = {
  "Dana masuk escrow": 0,
  "Konten disetujui": 1,
  Dicairkan: 2,
};

interface EscrowBadgeProps {
  status: EscrowStatus;
  compact?: boolean;
  account?: string;
}

export function EscrowBadge({ status, compact = false, account }: EscrowBadgeProps) {
  const current = statusIndex[status];

  if (compact) {
    const isDisbursed = status === "Dicairkan";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
          isDisbursed
            ? "bg-[#25D366]/15 text-[#1DA851]"
            : "bg-amber/15 text-amber-800"
        )}
      >
        {isDisbursed ? <Banknote className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
        {isDisbursed ? "Dana cair" : "Dana aman"}
      </span>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const pending = i > current;
        return (
          <div key={step.status} className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                done && "bg-[#25D366] text-white",
                active && "bg-amber text-espresso ring-2 ring-amber/30",
                pending && "bg-bone-dark text-muted-foreground"
              )}
            >
              {step.icon}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  done && "text-[#1DA851]",
                  active && "text-espresso",
                  pending && "text-muted-foreground"
                )}
              >
                {step.status === "Dicairkan" && account
                  ? `Dicairkan ke ${account}`
                  : step.label}
              </p>
              {active && (
                <p className="text-xs text-muted-foreground mt-0.5">Sedang berjalan</p>
              )}
              {done && (
                <p className="text-xs text-[#25D366] mt-0.5">Selesai ✓</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
