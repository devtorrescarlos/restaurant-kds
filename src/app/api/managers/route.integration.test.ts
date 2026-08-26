import { vi, expect, describe, it, beforeEach, afterEach } from "vitest";
import { GET } from "./route";
import { createRequest, VALID_UUID } from "@/lib/test-helpers";
import dotenv from "dotenv";
dotenv.config();

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
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
];

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

describe("GET /api/managers", () => {
  it("should return managers with default pagination", async () => {
    prismaMock.user.findMany.mockResolvedValue(mockManagers);
    prismaMock.user.count.mockResolvedValue(mockManagers.length);

    const req = createRequest("/api/managers");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(2);
    expect(body.total).toBe(2);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(10);
  });

  it("should return managers filtered by status", async () => {
    const pendingOnly = [mockManagers[0]];
    prismaMock.user.findMany.mockResolvedValue(pendingOnly);
    prismaMock.user.count.mockResolvedValue(1);

    const req = createRequest("/api/managers?status=PENDING");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].status).toBe("PENDING");
    expect(body.total).toBe(1);
  });

  it("should respect custom page and limit", async () => {
    prismaMock.user.findMany.mockResolvedValue([mockManagers[1]]);
    prismaMock.user.count.mockResolvedValue(5);

    const req = createRequest("/api/managers?page=2&limit=1");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.page).toBe(2);
    expect(body.limit).toBe(1);
    expect(body.total).toBe(5);

    const findManyArgs = prismaMock.user.findMany.mock.calls[0][0];
    expect(findManyArgs.skip).toBe(1);
    expect(findManyArgs.take).toBe(1);
  });

  it("should return empty data when no managers match", async () => {
    prismaMock.user.findMany.mockResolvedValue([]);
    prismaMock.user.count.mockResolvedValue(0);

    const req = createRequest("/api/managers?status=SUSPENDED");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.total).toBe(0);
  });

  it("should return 400 for invalid page", async () => {
    const req = createRequest("/api/managers?page=-1");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
    expect(body.details).toBeDefined();
  });

  it("should return 400 for limit exceeding max", async () => {
    const req = createRequest("/api/managers?limit=999");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });

  it("should return 400 for non-numeric page", async () => {
    const req = createRequest("/api/managers?page=abc");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });
});
