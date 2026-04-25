// app/api/auth/[...all]/route.ts
import { getAuth } from "@/lib/auth/index";
import { NextRequest } from "next/server";

export const POST = async (req: Request) => {
  const auth = await getAuth();
  return auth.handler(req);
};

export const GET = async (req: NextRequest) => {

  const auth = await getAuth();
  const response = await auth.handler(req);
  
  return response;
};