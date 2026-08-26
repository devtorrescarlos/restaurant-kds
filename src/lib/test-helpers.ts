import { NextRequest } from "next/server";

export const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
export const INVALID_UUID = "not-a-uuid";
export function createRequest(path: string) {
  return new NextRequest(
    new URL(path, process.env.NEXT_PUBLIC_APP_HOST ?? "http://localhost"),
  );
}
