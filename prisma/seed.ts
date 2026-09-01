import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org1 = await prisma.organization.create({
    data: { name: "Restaurante El Fogón" },
  });

  const org2 = await prisma.organization.create({
    data: { name: "Café La Esquina" },
  });

  const password = await bcrypt.hash("password123", 10);

  const managers = [
    {
      name: "Ana García",
      email: "ana@example.com",
      password,
      role: "MANAGER" as const,
      status: "APPROVED" as const,
      is_active: true,
      organizationId: org1.id,
    },
    {
      name: "Carlos López",
      email: "carlos@example.com",
      password,
      role: "MANAGER" as const,
      status: "APPROVED" as const,
      is_active: true,
      organizationId: org1.id,
    },
    {
      name: "María Ruiz",
      email: "maria@example.com",
      password,
      role: "MANAGER" as const,
      status: "PENDING" as const,
      is_active: false,
      organizationId: org2.id,
    },
    {
      name: "Pedro Sánchez",
      email: "pedro@example.com",
      password,
      role: "MANAGER" as const,
      status: "PENDING" as const,
      is_active: false,
      organizationId: org2.id,
    },
    {
      name: "Laura Díaz",
      email: "laura@example.com",
      password,
      role: "MANAGER" as const,
      status: "SUSPENDED" as const,
      is_active: false,
      organizationId: org1.id,
    },
    {
      name: "Juan Torres",
      email: "juan@example.com",
      password,
      role: "MANAGER" as const,
      status: "APPROVED" as const,
      is_active: true,
      organizationId: org1.id,
    },
    {
      name: "Isabel Moreno",
      email: "isabel@example.com",
      password,
      role: "MANAGER" as const,
      status: "PENDING" as const,
      is_active: false,
      organizationId: org2.id,
    },
    {
      name: "Juan Galicia",
      email: "juang@example.com",
      password,
      role: "MANAGER" as const,
      status: "SUSPENDED" as const,
      is_active: false,
      organizationId: org1.id,
    },
    {
      name: "Pedro Suarez",
      email: "suarezpedro@example.com",
      password,
      role: "MANAGER" as const,
      status: "APPROVED" as const,
      is_active: false,
      organizationId: org2.id,
    },
    {
      name: "Fernando Torres",
      email: "fernandot@example.com",
      password,
      role: "MANAGER" as const,
      status: "APPROVED" as const,
      is_active: false,
      organizationId: org2.id,
    },
    {
      name: "Rodrigo Mendez",
      email: "rodrigo@example.com",
      password,
      role: "MANAGER" as const,
      status: "SUSPENDED" as const,
      is_active: false,
      organizationId: org2.id,
    },
    {
      name: "Luis Caballero",
      email: "luis@example.com",
      password,
      role: "MANAGER" as const,
      status: "APPROVED" as const,
      is_active: true,
      organizationId: org2.id,
    },
  ];

  for (const manager of managers) {
    await prisma.user.create({ data: manager });
  }

  console.log(
    `Seed completado: ${managers.length} managers creados en 2 organizaciones`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
