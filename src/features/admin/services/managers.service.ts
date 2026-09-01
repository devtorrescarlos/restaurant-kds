import { prisma } from "@/lib/prisma";
import { UserStatus } from "@/generated/prisma/enums";
import { CONFLICT, NOT_FOUND } from "@/lib/errors";

export const getManagerStats = async () => {
  const [grouped, total] = await Promise.all([
    prisma.user.groupBy({
      by: ["status"],
      where: { role: "MANAGER" },
      _count: { status: true },
    }),
    prisma.user.count({ where: { role: "MANAGER" } }),
  ]);

  const byStatus = (status: UserStatus) =>
    grouped.find((group) => group.status === status)?._count.status ?? 0;

  return {
    total,
    approved: byStatus(UserStatus.APPROVED),
    pending: byStatus(UserStatus.PENDING),
    suspended: byStatus(UserStatus.SUSPENDED),
  };
};

export const getManagers = async (params: {
  page: number;
  limit: number;
  search?: string;
  status?: UserStatus;
}) => {  const managers = await prisma.user.findMany({
    where: {
      role: "MANAGER",
      status: params.status,
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { email: { contains: params.search, mode: "insensitive" } },
          {
            organization: {
              name: { contains: params.search, mode: "insensitive" },
            },
          },
        ],
      }),
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
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { email: { contains: params.search, mode: "insensitive" } },
          {
            organization: {
              name: { contains: params.search, mode: "insensitive" },
            },
          },
        ],
      }),
    },
  });

  return {
    data: managers,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
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
