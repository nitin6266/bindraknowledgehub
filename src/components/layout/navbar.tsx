"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface NavbarProps {
  /** When true the bar is transparent until the user scrolls (hero pages). */
  transparentTop?: boolean;
}

export function Navbar({ transparentTop = true }: NavbarProps) {
  const scrolled = useScrolled(24);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const solid = !transparentTop || scrolled;

  // Close mobile menu on route change.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-normal ease-soft-out",
        "border-b border-slate-200 bg-white shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950",
        solid
          ? "lg:border-slate-200 lg:bg-white/90 lg:backdrop-blur-lg lg:shadow-sm dark:lg:border-slate-800 dark:lg:bg-slate-950/90"
          : "lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-container items-center justify-between px-5 sm:px-7 lg:px-8"
      >
        <BrandMark />

        <DesktopNav pathname={pathname} />

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="max-lg:h-11 max-lg:w-11" />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/admissions">Admissions</Link>
          </Button>

          <MobileToggle open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
        </div>
      </nav>

      {mobileOpen && <MobileNav pathname={pathname} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

function BrandMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground lg:h-9 lg:w-9"
      >
        B
      </span>
      {/* Mobile/tablet: two-line branded wordmark (always visible) */}
      <span className="flex flex-col leading-none lg:hidden">
        <span className="font-heading text-[15px] font-bold tracking-tight text-foreground">
          Bindra
        </span>
        <span className="text-body-xs font-medium text-muted-foreground">Knowledge Hub</span>
      </span>
      {/* Desktop: single-line name */}
      <span className="hidden font-heading text-heading-sm font-bold tracking-tight text-foreground lg:inline">
        {siteConfig.name}
      </span>
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <ul className="hidden items-center gap-0.5 lg:flex">
      {siteConfig.nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3.5 py-2 text-body-sm font-medium transition-all duration-fast",
                "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                "hover:scale-[1.02] active:scale-[0.98]",
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 dark:text-slate-400",
              )}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-all duration-fast hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 lg:hidden"
    >
      {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
    </button>
  );
}

function MobileNav({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  // Close on Escape for keyboard users.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="lg:hidden"
    >
      <div className="fixed inset-0 top-16 z-40 overflow-y-auto border-t border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-950 animate-enter-fade">
        <ul className="flex flex-col gap-0.5">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-4 py-3.5 text-body font-medium transition-all duration-fast",
                    "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                    "active:scale-[0.98]",
                    active
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                      : "text-slate-600 dark:text-slate-400",
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/admissions" onClick={onClose}>
            Apply for Admissions
          </Link>
        </Button>
      </div>
    </div>
  );
}