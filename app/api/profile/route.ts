import { connectToDB } from "@/lib/db/connect";
import { UserProfile } from "@/lib/models/userProfile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const userId = req.headers.get("x-user-id"); // 👈 replace with auth later

    const profile = await UserProfile.findOne({ userId })
      .populate("wishlistItems.productId")
      .lean();

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, address } = body;

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      profile = await UserProfile.create({
        userId,
        addresses: [address],
      });
    } else {
      profile.addresses.push(address);
      await profile.save();
    }

    return NextResponse.json(profile);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
