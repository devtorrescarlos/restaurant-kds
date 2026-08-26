import { vi, expect, describe, it, beforeEach, afterEach } from "vitest";
import { createRequest, VALID_UUID } from "@/lib/test-helpers";
import { POST } from "./route";
import dotenv from "dotenv";
import { UserStatus } from "@/generated/prisma/enums";
dotenv.config();

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { user: prismaMock.user },
}));

const mockManagers = [
  {
    id: VALID_UUID,
    email: "pending@test.com",
    name: "Test Pending",
    status: "PENDING",
    role: "MANAGER",
    organizationId: "org-1",
    organization: { name: "Test Org" },
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    email: "approved@test.com",
    name: "Test Approved",
    status: "APPROVED",
    role: "MANAGER",
    organizationId: "org-2",
    organization: { name: "Approved Org" },
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    email: "suspended@test.com",
    name: "Test Suspended",
    status: "SUSPENDED",
    role: "MANAGER",
    organizationId: "org-3",
    organization: { name: "Suspended Org" },
  },
];

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

describe("POST /api/managers/approve/{id}", () => {
  it("should approve a pending manager", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockManagers[0]);
    prismaMock.user.update.mockResolvedValue({
      ...mockManagers[0],
      status: UserStatus.APPROVED,
    });

    const req = createRequest(`/api/managers/approve/${VALID_UUID}`);
    const res = await POST(req, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.status).toEqual(UserStatus.APPROVED);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: VALID_UUID },
      data: { status: UserStatus.APPROVED },
    });
  });

  it("should approve a suspended manager", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockManagers[2]);
    prismaMock.user.update.mockResolvedValue({
      ...mockManagers[2],
      status: UserStatus.APPROVED,
    });

    const req = createRequest(`/api/managers/approve/${mockManagers[2].id}`);
    const res = await POST(req, {
      params: Promise.resolve({ id: mockManagers[2].id }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.status).toEqual(UserStatus.APPROVED);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: mockManagers[2].id },
      data: { status: UserStatus.APPROVED },
    });
  });

  it("should throw an error if user is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = createRequest(`/api/managers/approve/${VALID_UUID}`);
    const res = await POST(req, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    const body = await res.json();

    expect(body.error).toBe("Usuario no encontrado");
    expect(body.details.name).toBe("ServiceError");
    expect(res.status).toBe(404);
  });

  it("should throw an error if user has already been approved", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockManagers[1]);
    const req = createRequest(`/api/managers/approve/${mockManagers[1].id}`);
    const res = await POST(req, {
      params: Promise.resolve({ id: mockManagers[1].id }),
    });

    const body = await res.json();

    expect(body.error).toBe("El usuario ya está aprobado");
    expect(body.details.name).toBe("ServiceError");
    expect(res.status).toBe(409);
  });

  it("should throw a validation error if id is invalid", async () => {
    const req = createRequest(`/api/managers/approve/invalid`);
    const res = await POST(req, {
      params: Promise.resolve({ id: "invalid" }),
    });

    const body = await res.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details.name).toBe("ZodError");
    expect(res.status).toBe(400);
  });
});
