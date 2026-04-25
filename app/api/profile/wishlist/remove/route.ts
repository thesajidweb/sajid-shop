import { connectToDB } from "@/lib/db/connect";
import { UserProfile } from "@/lib/models/userProfile";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();

  const { userId, productId } = await req.json();

  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    {
      $pull: {
        wishlistItems: { productId },
      },
    },
    { new: true },
  );

  return NextResponse.json(profile);
}
