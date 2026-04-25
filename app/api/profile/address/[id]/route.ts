import { connectToDB } from "@/lib/db/connect";
import { UserProfile } from "@/lib/models/userProfile";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectToDB();
  const { id } = await params;
  const userId = req.headers.get("x-user-id");

  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $pull: { addresses: { _id: id } } },
    { new: true },
  );

  return NextResponse.json(profile);
}
