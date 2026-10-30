"use client";

import { useState } from "react";
import { useContent } from "@/hooks/content-provider";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm";
import { Button } from "@/components/ui/button";
import { useMediaUrl } from "@/hooks/use-media-url";
import { formatWhen } from "@/lib/utils";
import type { MediaMeta } from "@/types/content";

function MediaRow({ item, onDelete }: { item: MediaMeta; onDelete: (item: MediaMeta) => void }) {
  const url = useMediaUrl(item.id);
  return (
    <li className="grid gap-3 border border-line bg-card p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
      <div className="aspect-video bg-studio">
        {url && item.type.startsWith("image/") ? <img src={url} alt="" className="h-full w-full object-cover" /> : null}
        {url && item.type.startsWith("video/") ? <video src={url} className="h-full w-full object-cover" muted /> : null}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm">{item.name}</p>
        <p className="text-xs text-muted">
          {item.type} · {Math.ceil(item.size / 1024)} KB · {formatWhen(item.createdAt)}
        </p>
      </div>
      <Button type="button" variant="danger" size="sm" onClick={() => onDelete(item)}>
        Delete
      </Button>
    </li>
  );
}

export function MediaAdmin() {
  const { ready, media, saveMedia, deleteMedia } = useContent();
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  if (!ready) return <p className="text-sm text-muted">Loading catalog…</p>;

  return (
    <div>
      <h1 className="font-display text-4xl uppercase">Media</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Images and videos stay in this browser and can replace a poster or play in the preview. Keep each file under 12 MB.
      </p>
      <label className="mt-6 block max-w-md">
        <span className="label">Upload</span>
        <input
          className="field"
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file || busy) return;
            setBusy(true);
            try {
              await saveMedia(file);
              toast.success("Uploaded.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Upload failed.");
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {media.length === 0 ? <p className="mt-8 text-sm text-muted">No files uploaded yet. Posters still use the built-in frames.</p> : null}
      <ul className="mt-6 space-y-3">
        {media.map((item) => (
          <MediaRow
            key={item.id}
            item={item}
            onDelete={async (entry) => {
              const ok = await confirm({
                title: `Delete ${entry.name}?`,
                body: "Projects that used this file will fall back to their poster motif.",
                confirmLabel: "Delete",
              });
              if (!ok) return;
              try {
                await deleteMedia(entry.id);
                toast.success("Removed.");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Delete failed.");
              }
            }}
          />
        ))}
      </ul>
    </div>
  );
}
