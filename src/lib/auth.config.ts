import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/features/admin/validations/login.schema";
import { authenticateUser } from "@/features/admin/services/auth.service";
import { UserRole } from "@/generated/prisma/browser";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await authenticateUser(parsed.data);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export const authorizeUser = async (credentials: unknown) => {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const user = await authenticateUser(parsed.data);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

interface TokenPayload {
  id?: string | number;
  role?: unknown;
}

interface UserPayload {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  role?: unknown;
}

interface SessionWithUser {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: unknown;
  };
  [key: string]: unknown;
}

export const jwtCallback = ({ token, user }: { token: TokenPayload; user?: UserPayload }) => {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  return token;
};

export const sessionCallback = ({
  session,
  token,
}: {
  session: SessionWithUser;
  token: TokenPayload;
}) => {
  if (session.user) {
    session.user.id = String(token.id);
    session.user.role = token.role as UserRole;
  }
  return session;
};
