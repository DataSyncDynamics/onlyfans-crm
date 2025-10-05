export const APP_NAME = "OnlyFans CRM";
export const APP_DESCRIPTION = "Professional CRM for OnlyFans creators and agencies";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FANS: "/fans",
  REVENUE: "/revenue",
  CHATTERS: "/chatters",
  MARKETING: "/marketing",
  ALERTS: "/alerts",
} as const;

export const SUBSCRIPTION_TIERS = {
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export const CURRENCY = {
  USD: "USD",
  SYMBOL: "$",
} as const;

export const DATE_FORMATS = {
  SHORT: "MMM d, yyyy",
  LONG: "MMMM d, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMM d, yyyy h:mm a",
} as const;
