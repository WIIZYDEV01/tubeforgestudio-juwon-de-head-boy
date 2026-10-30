"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Moon, Sun, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/hooks/use-favorites";
import { useTheme } from "@/hooks/use-theme";
import { useContent } from "@/hooks/content-provider";
import { useBodyLock } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/layout/wordmark";
import { BackToTop } from "@/components/layout/back-to-top";
import { Cursor } from "@/components/layout/cursor";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";

const links = [
  { href: "/portfolio", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/case-studies", label: "Studies" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { ids } = useFavorites();
  useBodyLock(open);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-40 border-b", scrolled || open ? "border-line bg-studio" : "border-transparent bg-studio/80")}>
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8 lg:px-12">
          <Link href="/" aria-label="TubeForgeStudio home" className="min-w-0">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn("text-sm text-muted hover:text-ink", isActive(pathname, link.href) && "text-ink")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/favorites" className="relative hidden size-11 place-items-center border border-line sm:grid" aria-label={`Favorites, ${ids.length} saved`}>
              <Heart size={16} />
              {ids.length > 0 ? <span className="absolute right-1 top-1 font-mono text-[10px] text-accent">{ids.length}</span> : null}
            </Link>
            <button type="button" className="grid size-11 place-items-center border border-line" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button type="button" className="grid size-11 place-items-center border border-line xl:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="fixed inset-0 z-30 bg-studio pt-16 xl:hidden">
          <nav className="flex flex-col px-6 py-8" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="border-b border-line py-4 font-display text-4xl uppercase" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/faq" className="border-b border-line py-4 font-display text-4xl uppercase" onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <Link href="/favorites" className="border-b border-line py-4 font-display text-4xl uppercase" onClick={() => setOpen(false)}>
              Favorites
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}

export function HeaderFallback() {
  return <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-transparent bg-studio/80" />;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { ready, persistent, warning } = useContent();

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <ScrollProgress />
      <Cursor />
      <div className="pt-16">
        {ready && !persistent ? (
          <p className="bg-accent px-4 py-2 text-center text-sm text-accent-ink" role="status">
            Storage is unavailable in this browser. You can browse the sample catalog, but changes will not be kept.
          </p>
        ) : null}
        {ready && warning ? (
          <p className="border-b border-line bg-studio-2 px-4 py-2 text-center text-sm text-muted" role="status">
            {warning}
          </p>
        ) : null}
        <main id="content">{children}</main>
        <Footer />
      </div>
      <BackToTop />
    </>
  );
}
