"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "../validations/login.schema";

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    credentials?: string;
  };
};

export async function login(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { errors: { credentials: "Credenciales inválidas" } };
        case "CallbackRouteError":
          return {
            errors: { credentials: "Usuario no aprobado o suspendido" },
          };
        default:
          return { errors: { credentials: "No se pudo iniciar sesión" } };
      }
    }

    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
