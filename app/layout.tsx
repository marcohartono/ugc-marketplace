import type { Metadata } from "next";
import "./globals.css";
import { DevDrawer } from "@/components/shared/DevDrawer";
import { LangToggle } from "@/components/shared/LangToggle";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "KONTENIN",
  description: "Dapetin cuan dari konten yang kamu udah bikin tiap hari.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background antialiased">
        {children}
        <LangToggle />
        <DevDrawer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
