import { z } from "zod";
import { UserStatus, UserRole } from "@/generated/prisma/enums";

export const getManagerSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(UserStatus).optional(),
});

export const approveManagerSchema = z.object({
  id: z.uuid(),
});

export const suspendManagerSchema = z.object({
  id: z.uuid(),
});

export const managerResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  status: z.enum(UserStatus),
  role: z.enum(UserRole),
  organizationId: z.uuid().nullable(),
  organization: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

export const getManagersResponseSchema = z.object({
  data: managerResponseSchema.array(),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type GetManagersResponse = z.infer<typeof getManagersResponseSchema>;
export type GetManager = z.infer<typeof managerResponseSchema>;
