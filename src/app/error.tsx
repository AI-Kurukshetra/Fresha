"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void error;
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-4 rounded-3xl bg-white p-8 shadow-card">
        <h2 className="font-display text-2xl text-ink-900">Something went wrong</h2>
        <p className="text-sm text-ink-600">Please try again. If the issue persists, contact the salon.</p>
        <button
          className="rounded-full bg-ink-900 px-6 py-2 text-sm font-semibold text-sand-50"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
