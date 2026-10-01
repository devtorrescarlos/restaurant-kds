import { prisma } from "@/lib/prisma";
import { LoginInput } from "../validations/login.schema";
import { verifyPassword } from "@/lib/passwordHashing";
import { UserStatus } from "@/generated/prisma/enums";

export const authenticateUser = async (credentials: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) return null;

  const isPasswordValid = await verifyPassword(
    credentials.password,
    user.password,
  );

  if (!isPasswordValid) return null;

  if (user.status === UserStatus.PENDING) {
    throw new Error("El usuario no está aprobado");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new Error("El usuario está suspendido");
  }

  return user;
};
