import { NextRequest, NextResponse } from "next/server";
import { ServiceError } from "@/lib/errors";
import { success } from "@/lib/api";
import { suspendManagers } from "@/features/admin/services/managers.service";
import { approveManagerSchema } from "@/features/admin/validations/manager.schema";

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

    const manager = await suspendManagers(parse.data.id);

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
