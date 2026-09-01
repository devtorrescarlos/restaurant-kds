import { UserStatus } from "@/generated/prisma/enums";
import type { GetManager } from "./validations/manager.schema";

const VALID_UUID = "660e8400-e29b-41d4-a716-446655440000";

export const mockManagers: GetManager[] = [
  {
    id: VALID_UUID,
    name: "Juan Carlos",
    email: "juan@test.com",
    status: UserStatus.APPROVED,
    role: "MANAGER",
    organizationId: "org-1",
    organization: { name: "Restaurante El Fogón" },
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    name: "María Pérez",
    email: "maria@test.com",
    status: UserStatus.PENDING,
    role: "MANAGER",
    organizationId: "org-2",
    organization: { name: "Café de la Plaza" },
  },
];

export const mockManagersProps = {
  initialData: mockManagers,
  initialTotal: mockManagers.length,
  initialTotalPages: 1,
  initialPage: 1,
  limit: 10,
  initialSearch: "",
  initialStatus: undefined,
} as const;

type HookParams = {
  initialData: GetManager[];
  initialTotal: number;
  initialTotalPages: number;
  initialPage: number;
  limit: number;
  initialSearch: string;
  initialStatus: UserStatus | undefined;
};

export const mockUseManagersParams: HookParams = {
  ...mockManagersProps,
};
