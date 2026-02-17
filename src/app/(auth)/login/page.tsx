import Link from "next/link";
import { ActionForm } from "@/components/features/ActionForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signIn } from "@/app/(auth)/actions";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-ink-900">Welcome back</h1>
        <p className="text-sm text-ink-600">Sign in to manage bookings and schedules.</p>
      </div>
      <ActionForm action={signIn}>
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input label="Password" name="password" type="password" autoComplete="current-password" required />
        <Button type="submit">Sign in</Button>
      </ActionForm>
      <p className="text-sm text-ink-600">
        New to Fresha Studio?{" "}
        <Link href="/signup" className="font-semibold text-rose-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
