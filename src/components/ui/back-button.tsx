import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const handleBack = () => {
    haptic("light");
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--gold)]",
        className
      )}
    >
      <span className="text-lg">←</span>
      <span>الرجوع</span>
    </button>
  );
}
