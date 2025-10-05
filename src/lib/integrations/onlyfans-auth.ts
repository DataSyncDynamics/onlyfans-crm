/**
 * OnlyFans OAuth Authentication Flow
 * Handles creator authorization and token management
 */

const ONLYFANS_OAUTH_URL = process.env.ONLYFANS_OAUTH_URL || "https://onlyfans.com/oauth/authorize";
const ONLYFANS_TOKEN_URL = process.env.ONLYFANS_TOKEN_URL || "https://onlyfans.com/oauth/token";
const ONLYFANS_CLIENT_ID = process.env.ONLYFANS_CLIENT_ID;
const ONLYFANS_CLIENT_SECRET = process.env.ONLYFANS_CLIENT_SECRET;
const ONLYFANS_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + "/api/auth/onlyfans/callback";

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  expiresAt: Date;
}

export class OnlyFansAuth {
  /**
   * Generate OAuth authorization URL for creator to authorize app
   */
  static getAuthorizationUrl(creatorId: string): string {
    const params = new URLSearchParams({
      client_id: ONLYFANS_CLIENT_ID || "",
      redirect_uri: ONLYFANS_REDIRECT_URI,
      response_type: "code",
      scope: "read:stats read:transactions read:subscribers",
      state: creatorId, // Pass creator ID in state to identify after callback
    });

    return `${ONLYFANS_OAUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<OAuthTokens | null> {
    try {
      const response = await fetch(ONLYFANS_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          client_id: ONLYFANS_CLIENT_ID,
          client_secret: ONLYFANS_CLIENT_SECRET,
          redirect_uri: ONLYFANS_REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };
    } catch (error) {
      console.error("Failed to exchange code for token:", error);
      return null;
    }
  }

  /**
   * Refresh expired access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<OAuthTokens | null> {
    try {
      const response = await fetch(ONLYFANS_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: ONLYFANS_CLIENT_ID,
          client_secret: ONLYFANS_CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  /**
   * Revoke access token (disconnect creator)
   */
  static async revokeToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${ONLYFANS_OAUTH_URL}/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: accessToken,
          client_id: ONLYFANS_CLIENT_ID,
          client_secret: ONLYFANS_CLIENT_SECRET,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to revoke token:", error);
      return false;
    }
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  static isTokenExpired(expiresAt: Date): boolean {
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiresAt <= fiveMinutesFromNow;
  }

  /**
   * Encrypt token for storage (basic encryption - in production use proper encryption)
   */
  static encryptToken(token: string): string {
    // In production, use a proper encryption library like crypto-js or node:crypto
    // For now, we'll use base64 encoding as a placeholder
    // TODO: Implement proper encryption with Supabase Vault
    return Buffer.from(token).toString("base64");
  }

  /**
   * Decrypt token from storage
   */
  static decryptToken(encryptedToken: string): string {
    // In production, use proper decryption
    // TODO: Implement proper decryption
    return Buffer.from(encryptedToken, "base64").toString("utf-8");
  }
}
