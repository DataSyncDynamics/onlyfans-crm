import { NextResponse } from "next/server";
import { OnlyFansAuth } from "@/lib/integrations/onlyfans-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const creatorId = searchParams.get("state"); // Creator ID passed in state param
    const error = searchParams.get("error");

    if (error) {
      // User denied authorization
      return NextResponse.redirect(
        new URL(`/creators?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !creatorId) {
      return NextResponse.redirect(
        new URL("/creators?error=invalid_callback", request.url)
      );
    }

    // Exchange authorization code for access token
    const tokens = await OnlyFansAuth.exchangeCodeForToken(code);

    if (!tokens) {
      return NextResponse.redirect(
        new URL("/creators?error=token_exchange_failed", request.url)
      );
    }

    // Store tokens in database (encrypted)
    // TODO: Replace with Supabase storage
    OnlyFansAuth.encryptToken(tokens.accessToken);
    OnlyFansAuth.encryptToken(tokens.refreshToken);

    // For now, store in memory/session (temporary)
    // In production, save to Supabase with encrypted tokens

    // Trigger initial data sync (in background)
    // This will be handled by the sync endpoint after redirect

    // Redirect back to creators page with success
    return NextResponse.redirect(
      new URL(`/creators?connected=${creatorId}&sync=start`, request.url)
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/creators?error=callback_failed", request.url)
    );
  }
}
