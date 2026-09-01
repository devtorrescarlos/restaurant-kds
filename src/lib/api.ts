import { NextResponse } from "next/server";

export const success = (data: unknown, status = 200) => {
  return NextResponse.json({ data }, { status });
};

export const error = (message: string, status = 400) => {
  return NextResponse.json({ error: message }, { status });
};

export const paginate = (
  data: unknown[],
  total: number,
  page: number,
  limit: number,
) => {
  return NextResponse.json({
    data,
    total,
    page,
    limit,
  });
};
