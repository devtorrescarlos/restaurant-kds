import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserStatus, UserRole } from "@/generated/prisma/enums";
import { authenticateUser } from "./auth.service";

const { prismaMock, verifyPasswordMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
  },
  verifyPasswordMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: prismaMock.user.findUnique,
    },
  },
}));

vi.mock("@/lib/passwordHashing", () => ({
  verifyPassword: verifyPasswordMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authenticateUser", () => {
  it("should return null if user isn't found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const result = await authenticateUser({
      email: "[EMAIL_ADDRESS]",
      password: "[PASSWORD]",
    });
    expect(result).toBeNull();
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "[EMAIL_ADDRESS]" },
    });
  });

  it("should return null if password is wrong", async () => {
    const user = {
      id: 1,
      email: "[EMAIL_ADDRESS]",
      password: "[PASSWORD]",
      status: UserStatus.APPROVED,
      role: UserRole.ADMIN,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    verifyPasswordMock.mockResolvedValue(false);
    const result = await authenticateUser({
      email: "[EMAIL_ADDRESS]",
      password: "wrong-password",
    });
    expect(result).toBeNull();
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "[EMAIL_ADDRESS]" },
    });
  });

  it("should throw an error if user is suspended", async () => {
    const user = {
      id: 1,
      email: "[EMAIL_ADDRESS]",
      password: "[PASSWORD]",
      status: UserStatus.SUSPENDED,
      role: UserRole.ADMIN,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    verifyPasswordMock.mockResolvedValue(true);

    await expect(
      authenticateUser({
        email: "[EMAIL_ADDRESS]",
        password: "[PASSWORD]",
      }),
    ).rejects.toThrow("El usuario está suspendido");
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "[EMAIL_ADDRESS]" },
    });
  });

  it("should throw an error if user is pending", async () => {
    const user = {
      id: 1,
      email: "[EMAIL_ADDRESS]",
      password: "[PASSWORD]",
      status: UserStatus.PENDING,
      role: UserRole.ADMIN,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    verifyPasswordMock.mockResolvedValue(true);

    await expect(
      authenticateUser({
        email: "[EMAIL_ADDRESS]",
        password: "[PASSWORD]",
      }),
    ).rejects.toThrow("El usuario no está aprobado");
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "[EMAIL_ADDRESS]" },
    });
  });

  it("should return the user when credentials are valid", async () => {
    const user = {
      id: 1,
      email: "[EMAIL_ADDRESS]",
      password: "[PASSWORD]",
      status: UserStatus.APPROVED,
      role: UserRole.ADMIN,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    verifyPasswordMock.mockResolvedValue(true);

    const result = await authenticateUser({
      email: "[EMAIL_ADDRESS]",
      password: "[PASSWORD]",
    });

    expect(result).toEqual(user);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "[EMAIL_ADDRESS]" },
    });
  });
});
