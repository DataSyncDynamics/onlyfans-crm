import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: Implement OnlyFans data sync logic
    console.log("Sync request received:", body);

    return NextResponse.json({
      success: true,
      message: "Sync completed successfully",
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    lastSync: new Date().toISOString(),
  });
}
