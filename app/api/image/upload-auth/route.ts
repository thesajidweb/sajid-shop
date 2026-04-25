import { NextRequest, NextResponse } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import { requirePermission } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  try {
    const authSession = requirePermission(req, "MANAGE_IMAGES");
    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check environment variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      console.error("Missing ImageKit environment variables");
      return NextResponse.json(
        { error: "ImageKit configuration is missing" },
        { status: 500 },
      );
    }

    // Generate upload authentication parameters
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: privateKey,
      publicKey: publicKey,
      // =========  Optional: control expiry time (maximum 1 hour) =======
      // expire: 30 * 60, // 30 minutes
      //=========== Optional: custom token  ==========
      // token: "unique-token-" + Date.now(),
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: publicKey,
    });
  } catch (error) {
    console.error("Upload auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload authentication" },
      { status: 500 },
    );
  }
}
