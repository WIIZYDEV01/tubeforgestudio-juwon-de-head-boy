"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Options = {
  title: string;
  body: string;
  confirmLabel?: string;
  danger?: boolean;
};

const ConfirmContext = createContext<(options: Options) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<{ options: Options; resolve: (value: boolean) => void } | null>(null);

  const confirm = useCallback((options: Options) => {
    return new Promise<boolean>((resolve) => {
      setPending((current) => {
        current?.resolve(false);
        return { options, resolve };
      });
    });
  }, []);

  const close = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={Boolean(pending)} title={pending?.options.title ?? "Confirm"} onClose={() => close(false)}>
        <p className="text-sm leading-relaxed text-muted">{pending?.options.body}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button type="button" variant={pending?.options.danger === false ? "primary" : "danger"} onClick={() => close(true)}>
            {pending?.options.confirmLabel ?? "Delete"}
          </Button>
        </div>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
