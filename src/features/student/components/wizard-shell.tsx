"use client";

import { useCallback, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WizardShellProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onPrev: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  canNext?: boolean;
  canSubmit?: boolean;
  submitting?: boolean;
  submitLabel?: string;
  nextLabel?: string;
  wide?: boolean;
  onSaveDraft?: () => void;
  children: React.ReactNode;
}

export function WizardShell({
  step, totalSteps, title, subtitle,
  onPrev, onNext, onSubmit,
  canNext = true, canSubmit = true,
  submitting = false,
  submitLabel = "Submit", nextLabel = "Continue",
  wide = false,
  onSaveDraft,
  children,
}: WizardShellProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement;
        if (t.tagName === "TEXTAREA" && !e.metaKey) return;
        e.preventDefault();
        if (step === totalSteps - 1) onSubmit?.();
        else onNext?.();
      }
      if (e.key === "Escape") {
        onPrev();
      }
    },
    [step, totalSteps, onNext, onSubmit, onPrev],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border/40">
        <div className={cn("mx-auto px-6 py-3 flex items-center", wide ? "max-w-[900px]" : "max-w-[640px]")}>
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
        </div>
        <div className="h-0.5 bg-border/40">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-4">
        <div className={cn("w-full", wide ? "max-w-[900px]" : "max-w-[500px]")}>
          <div className="mb-6 text-center">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.1em] mb-2">
              Step {step + 1} of {totalSteps}
            </p>
            <h1 className="text-[32px] font-semibold tracking-tight text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-[14px] text-muted-foreground/60 leading-relaxed">{subtitle}</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <div className="space-y-5">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className={cn("mx-auto px-6 py-4 flex items-center justify-between", wide ? "max-w-[900px]" : "max-w-[500px]")}>
          <button
            type="button"
            onClick={onPrev}
            disabled={submitting}
            className="inline-flex h-10 items-center gap-1 text-[13px] text-muted-foreground/50 hover:text-foreground disabled:opacity-30 transition-colors"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <div className="flex items-center gap-3">
            {onSaveDraft && (
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={submitting}
                className="h-[44px] min-w-[140px] rounded-[10px] border border-border/60 bg-card px-6 text-[14px] font-medium text-foreground hover:bg-secondary/50 disabled:opacity-40 transition-all"
              >
                Save Draft
              </button>
            )}
            <span className="text-[11px] text-muted-foreground/30 tabular-nums">{step + 1}/{totalSteps}</span>
            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext || submitting}
                className="h-[44px] min-w-[140px] rounded-[10px] bg-primary px-6 text-[14px] font-medium text-white hover:brightness-105 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                {nextLabel} →
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit || submitting}
                className="h-[44px] min-w-[140px] rounded-[10px] bg-primary px-6 text-[14px] font-medium text-white hover:brightness-105 disabled:opacity-40 transition-all"
              >
                {submitting ? "Submitting…" : submitLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
