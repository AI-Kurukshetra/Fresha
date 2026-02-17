"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";
import type { ActionState } from "@/components/features/ActionForm";
import { logger } from "@/lib/logger";

const SignUpSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const signUp = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  };

  const parsed = SignUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return { status: "error", message: "Please provide valid signup details." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        role: "CUSTOMER"
      }
    }
  });

  if (error || !data.user) {
    logger.error({ error }, "Sign up failed");
    return { status: "error", message: error?.message ?? "Unable to sign up" };
  }

  redirect("/dashboard");
};

export const signIn = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password")
  };

  const parsed = SignInSchema.safeParse(rawData);
  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    logger.error({ error }, "Sign in failed");
    return { status: "error", message: "Invalid login credentials" };
  }

  redirect("/dashboard");
};

export const signOut = async (): Promise<void> => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
};
