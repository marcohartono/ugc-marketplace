"use client";
import { create } from "zustand";
import { brands, Brand, Brief, briefs as seedBriefs } from "@/lib/mockData";

export const DEMO_BRAND_ID = "brand-2";

interface DraftBrief extends Partial<Brief> {
  template?: string;
}

interface BrandStore {
  currentBrand: Brand;
  setCurrentBrand: (id: string) => void;
  shortlistedApps: string[];
  selectedApps: string[];
  shortlistApp: (id: string) => void;
  unselectApp: (id: string) => void;
  hireApp: (id: string) => void;
  publishedBriefs: Brief[];
  publishBrief: (brief: Brief) => void;
  draft: DraftBrief;
  setDraft: (patch: Partial<DraftBrief>) => void;
  resetDraft: () => void;
}

const EMPTY_DRAFT: DraftBrief = {
  template: undefined,
  title: "",
  category: undefined,
  description: "",
  hook_style: "",
  tone: "",
  must_mention: [],
  must_avoid: [],
  deliverables: "",
  usage_rights: "",
  payment_terms: "",
  budget_min: 0,
  budget_max: 0,
  slots_total: 5,
  deadline: "",
};

export const useBrandStore = create<BrandStore>((set) => ({
  currentBrand: brands.find((b) => b.id === DEMO_BRAND_ID)!,
  setCurrentBrand: (id) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) set({ currentBrand: brand });
  },

  shortlistedApps: ["app-4", "app-8"],
  selectedApps: ["app-1"],
  shortlistApp: (id) =>
    set((s) => ({ shortlistedApps: s.shortlistedApps.includes(id) ? s.shortlistedApps.filter((x) => x !== id) : [...s.shortlistedApps, id] })),
  unselectApp: (id) =>
    set((s) => ({ shortlistedApps: s.shortlistedApps.filter((x) => x !== id) })),
  hireApp: (id) =>
    set((s) => ({
      selectedApps: s.selectedApps.includes(id) ? s.selectedApps : [...s.selectedApps, id],
      shortlistedApps: s.shortlistedApps.filter((x) => x !== id),
    })),

  publishedBriefs: [],
  publishBrief: (brief) =>
    set((s) => ({ publishedBriefs: [brief, ...s.publishedBriefs] })),

  draft: EMPTY_DRAFT,
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  resetDraft: () => set({ draft: EMPTY_DRAFT }),
}));
