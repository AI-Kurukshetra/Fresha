import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-soft hover:from-rose-700 hover:to-rose-700",
  secondary: "bg-charcoal-900 text-white hover:bg-charcoal-700",
  outline: "border border-charcoal-100 text-charcoal-900 hover:border-rose-600 hover:text-rose-700",
  ghost: "text-charcoal-700 hover:bg-beige-100"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base"
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const spinner = (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 ease-out",
        isLoading ? "cursor-wait" : "cursor-pointer",
        "disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-beige-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-busy={isLoading}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? spinner : icon}
      <span className={cn(isLoading ? "opacity-90" : "", "inline-flex items-center")}>{children}</span>
    </button>
  );
}
