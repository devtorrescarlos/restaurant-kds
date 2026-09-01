import { vi, expect, describe, it, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { createRequest, VALID_UUID, INVALID_UUID } from "@/lib/test-helpers";
import dotenv from "dotenv";
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

vi.spyOn(console, "error").mockImplementation(() => {});

const baseManager = {
  id: VALID_UUID,
  email: "manager@test.com",
  name: "Test Manager",
  role: "MANAGER",
  organizationId: "org-1",
  organization: { name: "Test Org" },
};

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

describe("POST /api/managers/suspend/:id", () => {
  it("should suspend an APPROVED manager", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...baseManager,
      status: "APPROVED",
    });
    prismaMock.user.update.mockResolvedValue({
      ...baseManager,
      status: "SUSPENDED",
    });

    const res = await POST(
      createRequest(`/api/managers/suspend/${VALID_UUID}`),
      {
        params: Promise.resolve({ id: VALID_UUID }),
      },
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.status).toBe("SUSPENDED");
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: VALID_UUID },
    });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: VALID_UUID },
      data: { status: "SUSPENDED" },
    });
  });

  it("should suspend a PENDING manager", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...baseManager,
      status: "PENDING",
    });
    prismaMock.user.update.mockResolvedValue({
      ...baseManager,
      status: "SUSPENDED",
    });

    const res = await POST(
      createRequest(`/api/managers/suspend/${VALID_UUID}`),
      {
        params: Promise.resolve({ id: VALID_UUID }),
      },
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.status).toBe("SUSPENDED");
  });

  it("should return 409 if manager is already suspended", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...baseManager,
      status: "SUSPENDED",
    });

    const res = await POST(
      createRequest(`/api/managers/suspend/${VALID_UUID}`),
      {
        params: Promise.resolve({ id: VALID_UUID }),
      },
    );
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.error).toBe("El usuario ya está suspendido");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should return 404 if manager is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await POST(
      createRequest(`/api/managers/suspend/${VALID_UUID}`),
      {
        params: Promise.resolve({ id: VALID_UUID }),
      },
    );
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Usuario no encontrado");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid UUID", async () => {
    const res = await POST(
      createRequest(`/api/managers/suspend/${INVALID_UUID}`),
      {
        params: Promise.resolve({ id: INVALID_UUID }),
      },
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });
});
