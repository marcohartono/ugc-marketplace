"use client";
import { useLangStore } from "@/lib/stores/langStore";

export function LangToggle() {
  const { lang, toggle } = useLangStore();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className="fixed top-16 right-4 z-[60] flex items-center gap-1 bg-espresso text-bone text-[11px] font-semibold font-mono px-2.5 py-1 rounded-full shadow-md hover:bg-espresso-light transition-colors select-none"
    >
      <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
      <span className="opacity-30">·</span>
      <span className={lang === "id" ? "opacity-100" : "opacity-40"}>ID</span>
    </button>
  );
}
