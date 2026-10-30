"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createId } from "@/lib/utils";

type Toast = { id: string; message: string; tone: "ok" | "error" };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: Toast["tone"]) => {
    const id = createId("toast");
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4600);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push(message, "ok"),
      error: (message) => push(message, "error"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[75] flex w-[min(100%-2rem,22rem)] flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto border px-4 py-3 text-sm shadow-lg ${toast.tone === "ok" ? "border-ok/40 bg-card text-ink" : "border-danger/50 bg-card text-ink"}`}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <p>{toast.message}</p>
              <button
                type="button"
                className="font-mono text-[10px] uppercase tracking-wider text-muted"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");
  return context;
}
