import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-charcoal-100 bg-white/85 p-6 shadow-card backdrop-blur">
        {children}
      </div>
    </div>
  );
}
