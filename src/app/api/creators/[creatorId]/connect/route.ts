import { NextResponse } from "next/server";
import { OnlyFansAuth } from "@/lib/integrations/onlyfans-auth";

export async function POST(
  request: Request,
  { params }: { params: { creatorId: string } }
) {
  try {
    const { ofUsername } = await request.json();
    const { creatorId } = params;

    if (!ofUsername || !creatorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate OAuth authorization URL
    const authUrl = OnlyFansAuth.getAuthorizationUrl(creatorId);

    return NextResponse.json({
      success: true,
      authUrl,
      message: "Redirect to OnlyFans authorization",
    });
  } catch (error) {
    console.error("Connect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate connection" },
      { status: 500 }
    );
  }
}
