"use client";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { login, type LoginState } from "@/features/admin/actions/auth.action";

export default function AdminLoginForm() {
  const [state, formAction] = useActionState<LoginState | undefined, FormData>(
    login,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border bg-card p-6 shadow-sm lg:p-8"
      noValidate
    >
      <div className="grid gap-5">
        <div className="grid gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Correo electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@kitcho.com"
            aria-invalid={Boolean(state?.errors?.email)}
            className="h-11"
          />
          {state?.errors?.email ? (
            <p className="text-sm text-destructive" role="alert">
              {state.errors.email[0]}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            aria-invalid={Boolean(state?.errors?.password)}
            className="h-11"
          />
          {state?.errors?.password ? (
            <p className="text-sm text-destructive" role="alert">
              {state.errors.password[0]}
            </p>
          ) : null}
        </div>

        {state?.errors?.credentials ? (
          <div
            className={cn(
              "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
            )}
            role="alert"
          >
            {state.errors.credentials}
          </div>
        ) : null}
      </div>

      <SubmitButton label="Iniciar Sesión" />
    </form>
  );
}
