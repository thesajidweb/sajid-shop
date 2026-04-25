import { NextResponse } from "next/server";

export function apiResponse(message: string, status: number, data?: any) {
  return NextResponse.json({ message, data }, { status });
}
