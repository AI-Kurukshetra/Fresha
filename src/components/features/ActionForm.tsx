"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { cn } from "@/lib/utils/cn";

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

type ActionHandler = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

interface ActionFormProps {
  action: ActionHandler;
  children: ReactNode;
  successMessage?: string;
  className?: string;
}

const initialState: ActionState = { status: "idle" };

export function ActionForm({ action, children, successMessage, className }: ActionFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className={cn("flex flex-col gap-4", className)}>
      {children}
      {state.status === "error" ? (
        <span className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{state.message}</span>
      ) : null}
      {state.status === "success" ? (
        <span className="rounded-2xl bg-sand-100 px-4 py-3 text-sm text-ink-700">
          {state.message ?? successMessage}
        </span>
      ) : null}
    </form>
  );
}
