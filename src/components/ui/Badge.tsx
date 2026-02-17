import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: ReactNode;
  variant?: "mint" | "ink" | "cloud";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  mint: "bg-mint-100 text-mint-700",
  ink: "bg-ink-100 text-ink-700",
  cloud: "bg-cloud-100 text-ink-700"
};

export function Badge({ children, variant = "cloud" }: BadgeProps) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", variants[variant])}>{children}</span>
  );
}
