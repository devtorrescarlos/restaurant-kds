import { prisma } from "@/lib/prisma";
import { UserStatus } from "@/generated/prisma/enums";
import { CONFLICT, NOT_FOUND } from "@/lib/errors";

export const getManagers = async (params: {
  page: number;
  limit: number;
  status?: UserStatus;
}) => {
  const managers = await prisma.user.findMany({
    where: {
      role: "MANAGER",
      status: params.status,
    },
    skip: (params.page - 1) * params.limit,
    take: params.limit,
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      role: true,
      organizationId: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
    where: {
      role: "MANAGER",
      status: params.status,
    },
  });

  return { data: managers, pagination: { total } };
};

export const approveManagers = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw NOT_FOUND("Usuario no encontrado");
  }

  if (user.status === UserStatus.APPROVED) {
    throw CONFLICT("El usuario ya está aprobado");
  }

  const manager = await prisma.user.update({
    where: { id },
    data: { status: UserStatus.APPROVED },
  });

  return manager;
};

export const suspendManagers = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw NOT_FOUND("Usuario no encontrado");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw CONFLICT("El usuario ya está suspendido");
  }

  const manager = await prisma.user.update({
    where: { id },
    data: { status: UserStatus.SUSPENDED },
  });

  return manager;
};
