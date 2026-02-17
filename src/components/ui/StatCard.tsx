import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  helper?: string;
}

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <span className="text-xs uppercase tracking-[0.2em] text-ink-600">{label}</span>
      <span className="font-display text-3xl text-ink-900">{value}</span>
      {helper ? <span className="text-sm text-ink-600">{helper}</span> : null}
    </Card>
  );
}
