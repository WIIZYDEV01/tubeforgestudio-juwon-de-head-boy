"use client";

import { ConfirmProvider } from "@/components/ui/confirm";
import { ToastProvider } from "@/components/ui/toast";
import { ContentProvider } from "@/hooks/content-provider";
import { PreferencesProvider } from "@/hooks/use-theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <ToastProvider>
        <ConfirmProvider>
          <ContentProvider>{children}</ContentProvider>
        </ConfirmProvider>
      </ToastProvider>
    </PreferencesProvider>
  );
}
