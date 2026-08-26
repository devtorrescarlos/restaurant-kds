import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  approveManagers,
  getManagers,
  suspendManagers,
} from "./managers.service";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: prismaMock.user.findMany,
      count: prismaMock.user.count,
      findUnique: prismaMock.user.findUnique,
      update: prismaMock.user.update,
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const mockManagers = [
  {
    id: "1",
    email: "email@email.com",
    name: "Juan Carlos",
    status: "APPROVED",
    role: "MANAGER",
    organizationId: "1",
    organization: {
      name: "Restaurant 1",
    },
  },
  {
    id: "2",
    email: "email2@email.com",
    name: "Carlos",
    status: "PENDING",
    role: "MANAGER",
    organizationId: "2",
    organization: {
      name: "Restaurant 2",
    },
  },
  {
    id: "3",
    email: "email3@email.com",
    name: "Maria",
    status: "PENDING",
    role: "MANAGER",
    organizationId: "3",
    organization: {
      name: "Restaurant 3",
    },
  },
  {
    id: "4",
    email: "email4@email.com",
    name: "Ana",
    status: "SUSPENDED",
    role: "MANAGER",
    organizationId: "4",
    organization: {
      name: "Restaurant 4",
    },
  },
];

describe("getManagers", () => {
  it("should return managers with pagination", async () => {
    prismaMock.user.findMany.mockResolvedValue(mockManagers);
    prismaMock.user.count.mockResolvedValue(mockManagers.length);

    const result = await getManagers({
      page: 1,
      limit: 10,
      status: "APPROVED",
    });

    expect(result).toEqual({
      data: mockManagers,
      pagination: {
        total: mockManagers.length,
      },
    });
  });

  it("should return an empty array if there is not any manager", async () => {
    prismaMock.user.findMany.mockResolvedValue([]);
    prismaMock.user.count.mockResolvedValue(0);

    const result = await getManagers({
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: [],
      pagination: {
        total: 0,
      },
    });

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.count).toHaveBeenCalledTimes(1);
  });

  it("should pass pagination args to prisma", async () => {
    prismaMock.user.findMany.mockResolvedValue([]);
    prismaMock.user.count.mockResolvedValue(0);

    await getManagers({
      page: 3,
      limit: 10,
      status: "APPROVED",
    });

    const findManyArgs = prismaMock.user.findMany.mock.calls[0][0];

    expect(findManyArgs.skip).toBe(20);
    expect(findManyArgs.take).toBe(10);
    expect(findManyArgs.where).toEqual({
      role: "MANAGER",
      status: "APPROVED",
    });
  });

  it("should return managers when status is undefined", async () => {
    prismaMock.user.findMany.mockResolvedValue(mockManagers);
    prismaMock.user.count.mockResolvedValue(mockManagers.length);

    const result = await getManagers({
      page: 1,
      limit: 10,
      status: undefined,
    });

    expect(result).toEqual({
      data: mockManagers,
      pagination: {
        total: mockManagers.length,
      },
    });
  });

  it("should return an empty array when page is out of range", async () => {
    prismaMock.user.findMany.mockResolvedValue([]);
    prismaMock.user.count.mockResolvedValue(mockManagers.length);

    const result = await getManagers({
      page: 99,
      limit: 10,
      status: "APPROVED",
    });

    expect(result).toEqual({
      data: [],
      pagination: {
        total: mockManagers.length,
      },
    });
  });
});

describe("approveManagers", () => {
  it("should approve manager", async () => {
    const mockManager = mockManagers[1];

    prismaMock.user.findUnique.mockResolvedValue(mockManager);
    prismaMock.user.update.mockResolvedValue({
      ...mockManager,
      status: "APPROVED",
    });

    const result = await approveManagers("1");

    expect(result).toEqual({
      ...mockManager,
      status: "APPROVED",
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { status: "APPROVED" },
    });
  });

  it("should throw an error if manager is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(approveManagers("1")).rejects.toThrow("Usuario no encontrado");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should throw an error if manager is already approved", async () => {
    const mockManager = mockManagers[0];

    prismaMock.user.findUnique.mockResolvedValue(mockManager);

    await expect(approveManagers("1")).rejects.toThrow(
      "El usuario ya está aprobado",
    );

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});

describe("suspendManagers", () => {
  it("should suspend manager", async () => {
    const mockManager = mockManagers[1];

    prismaMock.user.findUnique.mockResolvedValue(mockManager);
    prismaMock.user.update.mockResolvedValue({
      ...mockManager,
      status: "SUSPENDED",
    });

    const result = await suspendManagers("1");

    expect(result).toEqual({
      ...mockManager,
      status: "SUSPENDED",
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { status: "SUSPENDED" },
    });
  });

  it("should throw an error if manager is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(suspendManagers("1")).rejects.toThrow("Usuario no encontrado");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should throw an error if manager is already suspended", async () => {
    const mockManager = mockManagers[3];

    prismaMock.user.findUnique.mockResolvedValue(mockManager);

    await expect(suspendManagers("1")).rejects.toThrow(
      "El usuario ya está suspendido",
    );

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
