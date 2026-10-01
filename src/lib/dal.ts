import { cache } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/enums";

export const verifySession = cache(async () => {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return {
    isAuth: true,
    userId: session.user.id,
    role: session.user.role as UserRole,
  };
});
