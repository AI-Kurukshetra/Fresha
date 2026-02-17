import Link from "next/link";
import { ActionForm } from "@/components/features/ActionForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signUp } from "@/app/(auth)/actions";

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-ink-900">Create your account</h1>
        <p className="text-sm text-ink-600">Book appointments and track your visits.</p>
      </div>
      <ActionForm action={signUp}>
        <Input label="Full name" name="name" type="text" autoComplete="name" required />
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input label="Password" name="password" type="password" autoComplete="new-password" required />
        <Button type="submit">Create account</Button>
      </ActionForm>
      <p className="text-sm text-ink-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-rose-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
