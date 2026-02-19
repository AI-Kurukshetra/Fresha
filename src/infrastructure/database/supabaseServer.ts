import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/config/env";

type CookieBatch = Parameters<SetAllCookies>[0];

const createClient = async (allowCookieWrite: boolean) => {
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookieItems: CookieBatch) => {
        if (!allowCookieWrite) {
          return;
        }

        cookieItems.forEach((cookie) => {
          cookieStore.set(cookie);
        });
      }
    }
  });
};

export const createSupabaseServerClient = async () => createClient(false);

export const createSupabaseServerActionClient = async () => createClient(true);
