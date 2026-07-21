"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Step {
  id: string;
  title: string;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  children: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  submitting?: boolean;
  nextDisabled?: boolean;
  submitLabel?: string;
  className?: string;
}

export function StepWizard({
  steps,
  currentStep,
  children,
  onNext,
  onPrevious,
  onSaveDraft,
  onSubmit,
  submitting = false,
  nextDisabled = false,
  submitLabel = "Submit",
  className,
}: StepWizardProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={cn("flex flex-col min-h-[calc(100vh-4rem)]", className)}>
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                        isCompleted && "bg-success text-success-foreground",
                        isActive && "bg-primary text-primary-foreground",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground",
                      )}
                    >
                      {isCompleted ? <Check className="size-4" /> : index + 1}
                    </div>
                    <span
                      className={cn(
                        "hidden sm:inline text-sm font-medium",
                        isActive && "text-foreground",
                        isCompleted && "text-muted-foreground",
                        !isActive && !isCompleted && "text-muted-foreground/60",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "hidden sm:block w-8 h-px mx-1",
                        index < currentStep ? "bg-success" : "bg-border",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {children}
      </div>

      <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstStep || submitting}
            >
              ← Previous
            </Button>
            <div className="flex items-center gap-2">
              {onSaveDraft && (
                <Button variant="ghost" size="sm" onClick={onSaveDraft} disabled={submitting}>
                  Save Draft
                </Button>
              )}
              {isLastStep ? (
                <Button onClick={onSubmit} loading={submitting} disabled={submitting || nextDisabled}>
                  {submitLabel}
                </Button>
              ) : (
                <Button onClick={onNext} disabled={nextDisabled || submitting}>
                  Next →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
