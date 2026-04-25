"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "id";

interface LangStore {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set, get) => ({
      lang: "en",
      setLang: (l) => set({ lang: l }),
      toggle: () => set({ lang: get().lang === "en" ? "id" : "en" }),
    }),
    { name: "kenangan-lang" }
  )
);
