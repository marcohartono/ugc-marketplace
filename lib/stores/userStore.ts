"use client";
import { create } from "zustand";
import { creators, Creator, DEFAULT_DEMO_USER_ID } from "@/lib/mockData";

interface UserStore {
  currentUser: Creator;
  setCurrentUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: creators.find((c) => c.id === DEFAULT_DEMO_USER_ID)!,
  setCurrentUser: (id) => {
    const user = creators.find((c) => c.id === id);
    if (user) set({ currentUser: user });
  },
}));
