"use client";
import { useLangStore } from "@/lib/stores/langStore";
import { en, id } from "@/lib/translations";

export function useT() {
  const lang = useLangStore((s) => s.lang);
  return lang === "id" ? id : en;
}
