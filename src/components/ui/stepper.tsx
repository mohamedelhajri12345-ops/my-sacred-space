"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface Step {
  id: string | number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  variant?: "default" | "compact" | "dots";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, className, variant = "default" }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-1 flex-col items-center">
                  {/* حلقة المرحلة */}
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted
                        ? "var(--gold)"
                        : isCurrent
                        ? "var(--gold)"
                        : "var(--muted)",
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative flex size-10 items-center justify-center rounded-full border-2 transition-all",
                      variant === "default" && "border-[var(--gold)]",
                      variant === "compact" && "size-8 border-transparent",
                      variant === "dots" && "size-3 rounded-full border-transparent",
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="size-5 text-[var(--gold-foreground)]" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-bold text-[var(--gold-foreground)]"
                      >
                        {index + 1}
                      </motion.span>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                    )}

                    {/* توهج للمرحلة الحالية */}
                    {isCurrent && variant !== "dots" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0.5, 0], scale: [1, 1.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-[var(--gold)]/30"
                      />
                    )}
                  </motion.div>

                  {/* عنوان المرحلة */}
                  {variant !== "dots" && (
                    <motion.div
                      initial={false}
                      animate={{ opacity: isCurrent ? 1 : 0.6 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 text-center"
                    >
                      <p
                        className={cn(
                          "text-xs font-medium",
                          isCurrent ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </p>
                      {step.description && variant === "default" && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {step.description}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* خط التوصيل بين المراحل */}
                {!isLast && (
                  <div className="relative h-0.5 flex-1 bg-muted ltr:ml-2 rtl:mr-2">
                    {/* الخلفية */}
                    <div className="absolute inset-0 bg-muted" />
                    {/* التقدم */}
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 origin-right rtl:origin-left bg-[var(--gold)]"
                      style={{ transformOrigin: "right" }}
                    />
                    {isCompleted && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 origin-right rtl:origin-left bg-[var(--gold)]"
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
);
Stepper.displayName = "Stepper";

// ===== مكون المحتوى المرتبط بالمرحلة =====
interface StepContentProps {
  steps: Step[];
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}

function StepContent({ steps, currentStep, children, className }: StepContentProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={{
            opacity: index === currentStep ? 1 : 0,
            x: index === currentStep ? 0 : index < currentStep ? -20 : 20,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn("w-full", index !== currentStep && "pointer-events-none absolute inset-0")}
          style={{ display: index === currentStep ? "block" : "none" }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// ===== أزرار التنقل =====
interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  nextDisabled?: boolean;
  className?: string;
}

function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  nextLabel = "التالي",
  previousLabel = "السابق",
  nextDisabled = false,
  className,
}: StepNavigationProps) {
  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < totalSteps - 1;

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      {/* زر الرجوع */}
      <button
        onClick={onPrevious}
        disabled={!canGoBack}
        className={cn(
          "press flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors",
          canGoBack
            ? "text-foreground hover:bg-secondary"
            : "cursor-not-allowed opacity-50",
        )}
      >
        <svg
          className="size-4 rtl:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {previousLabel}
      </button>

      {/* مؤشر المرحلة */}
      <span className="text-xs text-muted-foreground">
        {currentStep + 1} / {totalSteps}
      </span>

      {/* زر التالي */}
      <button
        onClick={onNext}
        disabled={!canGoForward || nextDisabled}
        className={cn(
          "press flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
          canGoForward && !nextDisabled
            ? "gradient-gold text-gold-foreground shadow-[var(--shadow-soft)]"
            : "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        {nextLabel}
        <svg
          className="size-4 rtl:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}

export { Stepper, StepContent, StepNavigation };
export type { StepperProps, StepContentProps, StepNavigationProps };
