import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) {
      const val = amount / 1_000_000;
      return `Rp ${val % 1 === 0 ? val : val.toFixed(2).replace(".", ",")}jt`;
    }
    if (amount >= 1_000) {
      return `Rp ${(amount / 1_000).toFixed(0)}rb`;
    }
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function relativeDate(dateStr: string): string {
  const now = new Date("2026-04-23");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMs < 0) {
    const futureDays = Math.abs(diffDays);
    if (futureDays === 0) return "hari ini";
    if (futureDays === 1) return "besok";
    return `${futureDays} hari lagi`;
  }
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function deadlineLabel(dateStr: string): string {
  const now = new Date("2026-04-23");
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Sudah lewat";
  if (diffDays === 0) return "Hari ini!";
  if (diffDays === 1) return "Besok";
  if (diffDays <= 3) return `${diffDays} hari lagi ⚡`;
  return `${diffDays} hari lagi`;
}

export function isUrgent(dateStr: string): boolean {
  const now = new Date("2026-04-23");
  const date = new Date(dateStr);
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
}
