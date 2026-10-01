import { vi, it, describe, beforeEach, expect } from "vitest";
import { UserRole } from "@/generated/prisma/enums";
import { authorizeUser, jwtCallback, sessionCallback } from "./auth.config";

const { authenticateUserMock } = vi.hoisted(() => ({
  authenticateUserMock: vi.fn(),
}));

vi.mock("@/features/admin/services/auth.service", () => ({
  authenticateUser: authenticateUserMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authorizeUser", () => {
  it("should return null if credentials are invalid", async () => {
    const result = await authorizeUser({
      email: "wrong-mail",
      password: "[PASSWORD]",
    });

    expect(result).toBeNull();
    expect(authenticateUserMock).not.toHaveBeenCalled();
  });

  it("should return null if authenticateUser returns null", async () => {
    authenticateUserMock.mockResolvedValue(null);

    const result = await authorizeUser({
      email: "valid@mail.com",
      password: "[PASSWORD]",
    });

    expect(result).toBeNull();
    expect(authenticateUserMock).toHaveBeenCalledWith({
      email: "valid@mail.com",
      password: "[PASSWORD]",
    });
  });

  it("should return the user data when credentials are valid", async () => {
    const user = {
      id: 1,
      name: "[USER_NAME]",
      email: "valid@mail.com",
      role: UserRole.ADMIN,
    };
    authenticateUserMock.mockResolvedValue(user);

    const result = await authorizeUser({
      email: "valid@mail.com",
      password: "[PASSWORD]",
    });

    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    expect(authenticateUserMock).toHaveBeenCalledWith({
      email: "valid@mail.com",
      password: "[PASSWORD]",
    });
  });
});

describe("jwtCallback", () => {
  it("should add id and role to the token when user is provided", () => {
    const token = {};
    const user = {
      id: 1,
      name: "[USER_NAME]",
      email: "valid@mail.com",
      role: UserRole.ADMIN,
    };

    const result = jwtCallback({ token, user });

    expect(result).toEqual({ id: user.id, role: user.role });
  });

  it("should return the token unchanged when no user is provided", () => {
    const token = { id: 1, role: UserRole.ADMIN };

    const result = jwtCallback({ token, user: undefined });

    expect(result).toEqual(token);
  });
});

describe("sessionCallback", () => {
  it("should add id and role to the session user", () => {
    const session = {
      user: { name: "[USER_NAME]", email: "valid@mail.com" },
    };
    const token = { id: 1, role: UserRole.ADMIN };

    const result = sessionCallback({ session, token });

    expect(result).toEqual({
      user: {
        name: "[USER_NAME]",
        email: "valid@mail.com",
        id: "1",
        role: UserRole.ADMIN,
      },
    });
  });

  it("should return the session unchanged when it has no user", () => {
    const session = {};
    const token = { id: 1, role: UserRole.ADMIN };

    const result = sessionCallback({ session, token });

    expect(result).toEqual(session);
  });
});
