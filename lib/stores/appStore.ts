"use client";
import { create } from "zustand";
import {
  Application,
  Job,
  Transaction,
  initialApplications,
  initialJobs,
  initialTransactions,
  ApplicationStatus,
  ContentStatus,
  EscrowStatus,
} from "@/lib/mockData";

interface Notification {
  id: string;
  type: "wa" | "payment" | "approval" | "match";
  title: string;
  body: string;
  created_at: string;
  read: boolean;
}

interface AppStore {
  applications: Application[];
  jobs: Job[];
  transactions: Transaction[];
  notifications: Notification[];
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  updateJobContentStatus: (id: string, status: ContentStatus) => void;
  updateJobEscrowStatus: (id: string, status: EscrowStatus) => void;
  addJobMessage: (jobId: string, text: string) => void;
  pushNotification: (n: Omit<Notification, "id" | "created_at" | "read">) => void;
  markAllRead: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  applications: initialApplications,
  jobs: initialJobs,
  transactions: initialTransactions,
  notifications: [
    {
      id: "notif-1",
      type: "match",
      title: "Shortlisted!",
      body: "Kopi Nusantara tertarik sama pitch lo untuk brief 'Ritual Kopi Pagi' 🎉",
      created_at: "2026-04-22T14:00:00",
      read: false,
    },
    {
      id: "notif-2",
      type: "approval",
      title: "Review dimulai",
      body: "Glow.id lagi review konten lo. Biasanya 24–48 jam ya.",
      created_at: "2026-04-22T10:30:00",
      read: true,
    },
  ],

  addApplication: (app) =>
    set((s) => ({ applications: [app, ...s.applications] })),

  updateApplicationStatus: (id, status) =>
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === id ? { ...a, status, updated_at: new Date().toISOString() } : a
      ),
    })),

  updateJobContentStatus: (id, status) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, content_status: status } : j)),
    })),

  updateJobEscrowStatus: (id, status) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, escrow_status: status } : j)),
    })),

  addJobMessage: (jobId, text) =>
    set((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              messages: [
                ...j.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: "creator",
                  sender_name: "Kamu",
                  text,
                  sent_at: new Date().toISOString(),
                },
              ],
            }
          : j
      ),
    })),

  pushNotification: (n) =>
    set((s) => ({
      notifications: [
        {
          ...n,
          id: `notif-${Date.now()}`,
          created_at: new Date().toISOString(),
          read: false,
        },
        ...s.notifications,
      ],
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
