import { paginate } from "@/lib/api";
import { getManagerSchema } from "@/features/admin/validations/manager.schema";
import { NextResponse, NextRequest } from "next/server";
import { getManagers } from "@/features/admin/services/managers.service";

export const GET = async (req: NextRequest) => {
  try {
    const parse = getManagerSchema.safeParse({
      page: req.nextUrl.searchParams.get("page") ?? undefined,
      limit: req.nextUrl.searchParams.get("limit") ?? undefined,
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    if (!parse.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parse.error },
        { status: 400 },
      );
    }

    const { data, pagination } = await getManagers(parse.data);

    return paginate(data, pagination.total, parse.data.page, parse.data.limit);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 },
    );
  }
};
