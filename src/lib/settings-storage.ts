// LocalStorage abstraction for settings
// Designed for easy migration to Supabase later

const STORAGE_PREFIX = "vaultcrm:";

export interface ProfileSettings {
  name: string;
  email: string;
  avatarUrl?: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
}

export interface NotificationPreferences {
  alertTypes: {
    revenue: boolean;
    message: boolean;
    chat: boolean;
    warning: boolean;
    info: boolean;
  };
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  thresholds: {
    revenueMinimum: number;
    fanTiers: string[];
    messageVolume: number;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  soundEnabled: boolean;
  badgeEnabled: boolean;
}

export interface AgencySettings {
  name: string;
  website?: string;
  logoUrl?: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  defaultCommission: number;
  businessHours: {
    start: string;
    end: string;
  };
  fiscalYearStart: number; // month (1-12)
}

// Default values
export const DEFAULT_PROFILE: ProfileSettings = {
  name: "Agency Manager",
  email: "manager@agency.com",
  timezone: "America/New_York",
  language: "en",
  dateFormat: "MM/DD/YYYY",
  currency: "USD",
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  alertTypes: {
    revenue: true,
    message: true,
    chat: true,
    warning: true,
    info: true,
  },
  channels: {
    inApp: true,
    email: false,
    push: false,
    sms: false,
  },
  thresholds: {
    revenueMinimum: 100,
    fanTiers: ["whale", "high"],
    messageVolume: 50,
  },
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00",
  },
  soundEnabled: true,
  badgeEnabled: true,
};

export const DEFAULT_AGENCY: AgencySettings = {
  name: "My Agency",
  contactEmail: "contact@agency.com",
  defaultCommission: 20,
  businessHours: {
    start: "09:00",
    end: "17:00",
  },
  fiscalYearStart: 1, // January
};

// Storage helpers
function getStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(getStorageKey(key));
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Profile settings
export function getProfileSettings(): ProfileSettings {
  return getFromStorage("profile", DEFAULT_PROFILE);
}

export function saveProfileSettings(settings: Partial<ProfileSettings>): void {
  const current = getProfileSettings();
  saveToStorage("profile", { ...current, ...settings });
}

// Notification preferences
export function getNotificationPreferences(): NotificationPreferences {
  return getFromStorage("notification-preferences", DEFAULT_NOTIFICATION_PREFS);
}

export function saveNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): void {
  const current = getNotificationPreferences();
  saveToStorage("notification-preferences", { ...current, ...preferences });
}

// Agency settings
export function getAgencySettings(): AgencySettings {
  return getFromStorage("agency-settings", DEFAULT_AGENCY);
}

export function saveAgencySettings(settings: Partial<AgencySettings>): void {
  const current = getAgencySettings();
  saveToStorage("agency-settings", { ...current, ...settings });
}

// Clear all settings (useful for testing/logout)
export function clearAllSettings(): void {
  if (typeof window === "undefined") return;

  const keys = ["profile", "notification-preferences", "agency-settings"];
  keys.forEach((key) => localStorage.removeItem(getStorageKey(key)));
}
