"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface WAToastProps {
  show: boolean;
  message: string;
  senderName?: string;
  phone?: string;
  onClose?: () => void;
}

export function WhatsAppToast({
  show,
  message,
  senderName = "KONTENIN",
  phone = "+62 812-xxxx-3421",
  onClose,
}: WAToastProps) {
  useEffect(() => {
    if (show && onClose) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  const now = new Date();
  const time = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(380px,calc(100vw-32px))]"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl border border-[#25D366]/20">
            {/* WA header bar */}
            <div className="bg-[#075E54] px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white text-sm font-bold">
                W
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">WhatsApp • {senderName}</p>
                <p className="text-[#B2DFDB] text-xs truncate">{phone}</p>
              </div>
              <span className="text-[#B2DFDB] text-xs">{time}</span>
            </div>
            {/* WA bubble */}
            <div className="bg-[#ECE5DD] px-4 py-3">
              <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm max-w-[90%]">
                <p className="text-[#111B21] text-sm leading-relaxed">{message}</p>
                <p className="text-[#8696A0] text-[10px] text-right mt-1">{time} ✓✓</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useWAToast() {
  const [state, setState] = useState({ show: false, message: "" });
  const trigger = (message: string) => setState({ show: true, message });
  const close = () => setState((s) => ({ ...s, show: false }));
  return { ...state, trigger, close };
}
