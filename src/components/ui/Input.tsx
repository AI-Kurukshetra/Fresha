import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-ink-700">
      {label ? <span className="font-semibold text-ink-900">{label}</span> : null}
      <input
        className={cn(
          "rounded-xl border border-charcoal-100 bg-white/80 px-4 py-2.5 text-sm text-charcoal-900 shadow-sm transition-all duration-300",
          "focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100",
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-ink-600">{hint}</span> : null}
    </label>
  );
}
