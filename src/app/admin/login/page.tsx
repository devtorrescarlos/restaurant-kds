import { StoreIcon } from "lucide-react";
import AdminLoginForm from "@/features/admin/components/admin-login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg">
          <StoreIcon className="size-7" />
        </div>
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-brand-secondary">
            Kitcho - Kitchen Manager
          </h1>
          <p className="text-sm text-brand-neutral">Panel de administración</p>
        </div>
      </div>

      <AdminLoginForm />

      <p className="mt-6 text-center text-sm text-brand-neutral">
        Solo personal autorizado puede acceder al panel
      </p>
    </div>
  );
}
