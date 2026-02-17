import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-charcoal-100 bg-white/80 p-6 shadow-soft backdrop-blur transition-all duration-300 ease-out hover:shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}
