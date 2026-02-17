import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  helper?: string;
}

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3 border border-charcoal-100 bg-white/70">
      <span className="text-xs uppercase tracking-[0.3em] text-charcoal-500">{label}</span>
      <span className="font-display text-3xl text-charcoal-900">{value}</span>
      {helper ? <span className="text-sm text-charcoal-500">{helper}</span> : null}
    </Card>
  );
}
