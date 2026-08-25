import { NextRequest, NextResponse } from "next/server";
import { approveManagerSchema } from "@/features/admin/validations/manager.schema";
import { ServiceError } from "@/lib/errors";
import { success } from "@/lib/api";
import { approveManagers } from "@/features/admin/services/managers.service";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const parse = approveManagerSchema.safeParse({
      id,
    });

    if (!parse.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parse.error },
        { status: 400 },
      );
    }

    const manager = await approveManagers(parse.data.id);

    return success(manager);
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json(
        { error: error.message, details: error },
        { status: error.status },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 },
    );
  }
};
