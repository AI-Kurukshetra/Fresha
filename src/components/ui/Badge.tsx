import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: ReactNode;
  variant?: "mint" | "ink" | "cloud";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  mint: "bg-rose-100 text-rose-700",
  ink: "bg-charcoal-100 text-charcoal-700",
  cloud: "bg-beige-100 text-charcoal-700"
};

export function Badge({ children, variant = "cloud" }: BadgeProps) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase", variants[variant])}>
      {children}
    </span>
  );
}
