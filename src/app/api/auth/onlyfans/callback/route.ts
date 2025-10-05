import { NextResponse } from "next/server";
import { OnlyFansAuth } from "@/lib/integrations/onlyfans-auth";
import { DataSyncService } from "@/lib/services/data-sync";

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
    const encryptedAccessToken = OnlyFansAuth.encryptToken(tokens.accessToken);
    const encryptedRefreshToken = OnlyFansAuth.encryptToken(tokens.refreshToken);

    // For now, store in memory/session (temporary)
    // In production, save to Supabase:
    // await supabase.from('creator_auth').insert({
    //   creator_id: creatorId,
    //   platform: 'onlyfans',
    //   access_token: encryptedAccessToken,
    //   refresh_token: encryptedRefreshToken,
    //   token_expires_at: tokens.expiresAt,
    // });

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
