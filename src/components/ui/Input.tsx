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
          "rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900",
          "focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-100",
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-ink-600">{hint}</span> : null}
    </label>
  );
}
