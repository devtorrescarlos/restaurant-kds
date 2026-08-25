import { z } from "zod";
import { UserStatus } from "@/generated/prisma/enums";

export const getManagerSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(UserStatus).optional(),
});

export const approveManagerSchema = z.object({
  id: z.uuid(),
});

export const suspendManagerSchema = z.object({
  id: z.uuid(),
});
