"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminSearchProvider, useAdminQuery } from "@/components/admin/search";
import { SectionFilm, filmForAdmin } from "@/components/animations/section-film";
import { Wordmark } from "@/components/layout/wordmark";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/content-provider";
import { cn } from "@/lib/utils";

const links = [
  ["Overview", "/admin"],
  ["Portfolio", "/admin/portfolio"],
  ["Services", "/admin/services"],
  ["Testimonials", "/admin/testimonials"],
  ["FAQs", "/admin/faqs"],
  ["Case studies", "/admin/case-studies"],
  ["Comparisons", "/admin/comparisons"],
  ["Inquiries", "/admin/inquiries"],
  ["Statistics", "/admin/statistics"],
  ["Media", "/admin/media"],
  ["Settings", "/admin/settings"],
] as const;

const pinSchema = z.object({ pin: z.string().min(1, "Enter the demonstration PIN.") });

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const pathname = usePathname();
  const { ready, settings } = useContent();
  const form = useForm<{ pin: string }>({ resolver: zodResolver(pinSchema), defaultValues: { pin: "" } });

  return (
    <div className="relative min-h-screen">
      <SectionFilm name={filmForAdmin(pathname)} quiet fixed />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-16">
      <Wordmark />
      <h1 className="mt-8 font-display text-5xl uppercase leading-none">Studio desk</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        This PIN only hides the desk in this browser. It is not secure login. Anyone with this device can read the PIN here, in website settings, or in a backup file.
      </p>
      <p className="mt-4 border border-line bg-card px-3 py-3 text-sm">
        Current demonstration PIN: <strong>{ready ? settings.adminPin : "…"}</strong>
      </p>
      <form
        className="mt-6 space-y-3"
        onSubmit={form.handleSubmit(({ pin }) => {
          if (!ready) return;
          if (pin !== settings.adminPin) {
            form.setError("pin", { message: "That PIN does not match the one stored in this browser." });
            return;
          }
          sessionStorage.setItem("tfs-admin", "yes");
          onUnlock();
        })}
      >
        <label>
          <span className="label">Demonstration PIN</span>
          <input className="field" type="password" autoComplete="off" {...form.register("pin")} />
          {form.formState.errors.pin ? <span className="mt-1 block text-xs text-danger">{form.formState.errors.pin.message}</span> : null}
        </label>
        <Button type="submit">Open desk</Button>
      </form>
      <Link href="/" className="mt-6 text-sm text-muted">
        Back to the site
      </Link>
      </div>
    </div>
  );
}

function Desk({ children, onLock }: { children: React.ReactNode; onLock: () => void }) {
  const pathname = usePathname();
  const { setQuery, query } = useAdminQuery();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const lock = () => {
    sessionStorage.removeItem("tfs-admin");
    onLock();
  };

  return (
    <div className="relative min-h-screen">
      <SectionFilm name={filmForAdmin(pathname)} quiet fixed />
      <div className="relative z-10 min-h-screen bg-studio/80 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      {open ? <button type="button" className="fixed inset-0 z-30 bg-black/60 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-line bg-studio p-4 lg:static lg:block lg:w-auto", open ? "block" : "hidden")}>
        <Wordmark />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Local demonstration</p>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Desk">
          {links.map(([label, href]) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={cn("px-2 py-2 text-sm", active ? "bg-card text-accent" : "text-muted hover:text-ink")} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <button type="button" className="mt-6 text-left text-xs text-muted" onClick={lock}>
          Lock desk
        </button>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
          <button type="button" className="grid size-11 place-items-center border border-line lg:hidden" aria-label="Open desk menu" onClick={() => setOpen(true)}>
            <Menu size={16} />
          </button>
          <label className="block min-w-0 flex-1">
            <span className="sr-only">Search the desk</span>
            <input className="field" value={query} placeholder="Search this desk" onChange={(event) => setQuery(event.target.value)} />
          </label>
          <Link href="/" className="hidden text-sm text-muted sm:inline">
            View site
          </Link>
          <button type="button" className="grid size-11 place-items-center border border-line lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={16} className={open ? "" : "opacity-40"} />
          </button>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
      </div>
    </div>
  );
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  useEffect(() => {
    setUnlocked(sessionStorage.getItem("tfs-admin") === "yes");
  }, []);
  if (unlocked === null) {
    return (
      <div className="relative min-h-screen">
        <SectionFilm name="ember" quiet fixed />
        <p className="relative z-10 p-8 text-sm text-muted">Opening the desk…</p>
      </div>
    );
  }
  if (!unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />;
  return (
    <AdminSearchProvider>
      <Desk onLock={() => setUnlocked(false)}>{children}</Desk>
    </AdminSearchProvider>
  );
}
