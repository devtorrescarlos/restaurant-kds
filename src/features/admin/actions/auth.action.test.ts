import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CallbackRouteError,
  CredentialsSignin,
  AuthError,
} from "@auth/core/errors";
import { login, logout } from "./auth.action";

const { signInMock, signOutMock } = vi.hoisted(() => ({
  signInMock: vi.fn(),
  signOutMock: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock("@/lib/auth", () => ({ signIn: signInMock, signOut: signOutMock }));
vi.mock("next-auth", async () => {
  const { AuthError } = await import("@auth/core/errors");
  return { AuthError };
});

describe("AuthAction", () => {
  it("should return an email validation error when the email is invalid", async () => {
    const formData = new FormData();
    formData.set("email", "invalid");
    formData.set("password", "secret123");

    const result = await login(undefined, formData);

    expect(result).toEqual({
      errors: { email: ["Correo electrónico inválido"] },
    });
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("should return a credentials error when sign-in fails", async () => {
    signInMock.mockRejectedValueOnce(new CredentialsSignin());
    const formData = new FormData();
    formData.set("email", "valid@mail.com");
    formData.set("password", "secret123");

    const result = await login(undefined, formData);

    expect(result).toEqual({
      errors: { credentials: "Credenciales inválidas" },
    });

    expect(signInMock).toHaveBeenCalledTimes(1);
  });

  it("should throw a validation error when password is empty", async () => {
    const formData = new FormData();
    formData.set("email", "valid@mail.com");
    formData.set("password", "");

    const result = await login(undefined, formData);

    expect(result).toEqual({
      errors: { password: ["La contraseña es obligatoria"] },
    });
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("should sign-in user when credentials are valid", async () => {
    signInMock.mockResolvedValueOnce({});
    const formData = new FormData();
    formData.set("email", "valid@mail.com");
    formData.set("password", "secret123");

    const result = await login(undefined, formData);

    expect(result).toEqual({});
    expect(signInMock).toHaveBeenCalledTimes(1);
  });

  it("should redirect to admin dashboard when login is successful", async () => {
    signInMock.mockResolvedValueOnce({});
    const formData = new FormData();
    formData.set("email", "valid@mail.com");
    formData.set("password", "secret123");

    const result = await login(undefined, formData);

    expect(result).toEqual({});
    expect(signInMock).toHaveBeenCalledWith("credentials", {
      email: "valid@mail.com",
      password: "secret123",
      redirectTo: "/admin",
    });
  });

  it("should throw when sign-in fails with a non-AuthError", async () => {
    signInMock.mockRejectedValueOnce(new Error("Something went wrong"));
    const formData = new FormData();
    formData.set("email", "valid@mail.com");
    formData.set("password", "secret123");

    await expect(login(undefined, formData)).rejects.toThrow(
      "Something went wrong",
    );
    expect(signInMock).toHaveBeenCalledTimes(1);
  });

  it("should handle callback route error", async () => {
    signInMock.mockRejectedValueOnce(new CallbackRouteError());
    const formData = new FormData();
    formData.set("email", "valid@mail.com");
    formData.set("password", "secret123");

    const result = await login(undefined, formData);

    expect(result).toEqual({
      errors: { credentials: "Usuario no aprobado o suspendido" },
    });
  });

  it("should handle default error when sign-in fails", async () => {
    signInMock.mockRejectedValueOnce(new AuthError());
    const formData = new FormData();
    formData.set("email", "valid@mail.com");
    formData.set("password", "secret123");

    const result = await login(undefined, formData);

    expect(result).toEqual({
      errors: { credentials: "No se pudo iniciar sesión" },
    });
  });

  it("should signout user", async () => {
    signOutMock.mockResolvedValueOnce({});
    await logout();
    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledWith({ redirectTo: "/admin/login" });
  });
});
