// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, it, expect, describe, afterEach } from "vitest";
import { login } from "@/features/admin/actions/auth.action";
import AdminLoginForm from "./admin-login-form";

vi.mock("@/features/admin/actions/auth.action", () => ({
  login: vi.fn(),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});

describe("AdminLoginForm", () => {
  it("should render login form properly", () => {
    render(<AdminLoginForm />);
    expect(screen.getByText("Iniciar Sesión")).toBeDefined();
    expect(screen.getByLabelText("Correo electrónico")).toBeDefined();
    expect(screen.getByLabelText("Contraseña")).toBeDefined();

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("should show validation errors when fields are empty", async () => {
    vi.mocked(login).mockResolvedValue({
      errors: {
        email: ["Correo electrónico es inválido"],
        password: ["La contraseña es obligatoria"],
      },
    });

    render(<AdminLoginForm />);
    const submitButton = screen.getByRole("button", { name: "Iniciar Sesión" });
    await fireEvent.click(submitButton);

    expect(
      await screen.findByText("Correo electrónico es inválido"),
    ).toBeDefined();
    expect(
      await screen.getByText("La contraseña es obligatoria"),
    ).toBeDefined();
  });

  it("should show validation error when email is invalid", async () => {
    vi.mocked(login).mockResolvedValue({
      errors: {
        email: ["Correo electrónico es inválido"],
      },
    });
    render(<AdminLoginForm />);
    const emailInput = screen.getByLabelText("Correo electrónico");
    await fireEvent.change(emailInput, { target: { value: "not-an-email" } });

    const submitButton = screen.getByRole("button", { name: "Iniciar Sesión" });
    await fireEvent.click(submitButton);
    expect(
      await screen.findByText("Correo electrónico es inválido"),
    ).toBeDefined();
  });

  it("should show validation error when password is incorrect", async () => {
    vi.mocked(login).mockResolvedValue({
      errors: {
        credentials: "Credenciales inválidas",
      },
    });

    render(<AdminLoginForm />);

    const passwordInput = screen.getByLabelText("Contraseña");
    await fireEvent.change(passwordInput, {
      target: { value: "wrong-password" },
    });

    const submitButton = screen.getByRole("button", { name: "Iniciar Sesión" });
    await fireEvent.click(submitButton);
    expect(await screen.findByText("Credenciales inválidas")).toBeDefined();
  });

  it("should submit the form and clear errors when no validation errors", async () => {
    vi.mocked(login).mockResolvedValue({});
    render(<AdminLoginForm />);

    const emailInput = screen.getByLabelText("Correo electrónico");
    await fireEvent.change(emailInput, {
      target: { value: "email@email.com" },
    });

    const passwordInput = screen.getByLabelText("Contraseña");
    await fireEvent.change(passwordInput, {
      target: { value: "correct-password" },
    });

    const submitButton = screen.getByRole("button", { name: "Iniciar Sesión" });
    await fireEvent.click(submitButton);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
