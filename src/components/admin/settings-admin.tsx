"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContent } from "@/hooks/content-provider";
import { useConfirm } from "@/components/ui/confirm";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { settingsFormSchema, type SiteSettings } from "@/lib/validation/schemas";

export function SettingsAdmin() {
  const { ready, settings, saveSettings, exportBackup, importBackup, resetSample } = useContent();
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const form = useForm<SiteSettings>({ resolver: zodResolver(settingsFormSchema), defaultValues: settings });

  useEffect(() => {
    if (ready) form.reset(settings);
  }, [ready, settings, form]);

  if (!ready) return <p className="text-sm text-muted">Loading catalog…</p>;

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-display text-4xl uppercase">Settings</h1>
        <p className="mt-3 text-sm text-muted">
          The demonstration PIN is stored in plain text in this browser. A backup file includes it. This is not account security.
        </p>
      </div>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await saveSettings(values);
            toast.success("Settings saved.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Save failed.");
          }
        })}
      >
        <label>
          <span className="label">Studio name</span>
          <input className="field" {...form.register("studioName")} />
        </label>
        <label>
          <span className="label">Email</span>
          <input className="field" {...form.register("email")} />
          <span className="mt-1 block text-xs text-muted">Shown on the contact page. The inquiry form still only saves a copy in this browser.</span>
        </label>
        <label>
          <span className="label">Phone / WhatsApp</span>
          <input className="field" {...form.register("whatsapp")} placeholder="2348087900285" />
          <span className="mt-1 block text-xs text-muted">Digits only, with country code. Shown as a call link and a WhatsApp link.</span>
        </label>
        <label>
          <span className="label">Hero headline</span>
          <textarea className="field min-h-24" {...form.register("heroHeadline")} />
        </label>
        <label>
          <span className="label">Hero description</span>
          <textarea className="field min-h-28" {...form.register("heroDescription")} />
        </label>
        <label>
          <span className="label">Demonstration PIN</span>
          <input className="field" {...form.register("adminPin")} />
        </label>
        {form.formState.errors.root ? null : null}
        {Object.values(form.formState.errors).map((error) =>
          error?.message ? (
            <p key={error.message} className="text-xs text-danger">
              {error.message}
            </p>
          ) : null,
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save settings
        </Button>
      </form>
      <section className="border border-line p-4">
        <h2 className="font-display text-2xl uppercase">Backup and restore</h2>
        <p className="mt-2 text-sm text-muted">Export a JSON file of the catalog, inquiries, settings, and uploaded media. Import replaces everything stored in this browser.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                const data = await exportBackup();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `tubeforgestudio-backup-${data.exportedAt.slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(url);
                toast.success("Backup downloaded.");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Export failed.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Export JSON
          </Button>
          <label className={busy ? "pointer-events-none opacity-50" : ""}>
            <span className="sr-only">Import JSON backup</span>
            <input
              className="field max-w-xs"
              type="file"
              accept="application/json,.json"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                const ok = await confirm({
                  title: "Replace the catalog?",
                  body: "This overwrites projects, services, inquiries, settings, and media stored in this browser.",
                  confirmLabel: "Replace",
                });
                if (!ok) return;
                setBusy(true);
                try {
                  const text = await file.text();
                  const json = JSON.parse(text) as unknown;
                  await importBackup(json);
                  toast.success("Backup restored.");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "That file could not be imported.");
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
        </div>
      </section>
      <section className="border border-danger/40 p-4">
        <h2 className="font-display text-2xl uppercase">Reset sample catalog</h2>
        <p className="mt-2 text-sm text-muted">Puts the original concept projects back and removes inquiries and uploads from this browser.</p>
        <Button
          type="button"
          className="mt-4"
          variant="danger"
          onClick={async () => {
            const ok = await confirm({
              title: "Reset the sample catalog?",
              body: "Inquiries and uploaded files in this browser will be removed.",
              confirmLabel: "Reset",
            });
            if (!ok) return;
            try {
              await resetSample();
              toast.success("Sample catalog restored.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Reset failed.");
            }
          }}
        >
          Reset sample content
        </Button>
      </section>
    </div>
  );
}
