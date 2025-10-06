"use client";

import * as React from "react";
import { SettingsSection } from "@/components/settings/settings-section";
import { FormField } from "@/components/settings/form-field";
import {
  getProfileSettings,
  saveProfileSettings,
  type ProfileSettings,
} from "@/lib/settings-storage";
import { User, Save, X } from "lucide-react";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
];

export default function ProfileSettingsPage() {
  const [settings, setSettings] = React.useState<ProfileSettings>(getProfileSettings());
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const handleChange = (key: keyof ProfileSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    saveProfileSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
    }, 500);
  };

  const handleReset = () => {
    setSettings(getProfileSettings());
    setHasChanges(false);
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
            <User className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
            <p className="text-sm text-slate-400">
              Manage your personal account information
            </p>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-8">
        {/* Account Information */}
        <SettingsSection
          title="Account Information"
          description="Your personal details and contact information"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Full Name"
              description="Your full name as it appears"
              required
            >
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="John Doe"
              />
            </FormField>

            <FormField
              label="Email Address"
              description="Your primary email for notifications"
              required
            >
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="john@example.com"
              />
            </FormField>
          </div>

          <FormField
            label="Time Zone"
            description="Used for scheduling and time displays"
          >
            <select
              value={settings.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </FormField>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection
          title="Preferences"
          description="Customize how you view and interact with data"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Language"
              description="Interface language"
            >
              <select
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Date Format"
              description="How dates are displayed"
            >
              <select
                value={settings.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              >
                {DATE_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Currency"
              description="Default currency for revenue displays"
            >
              <select
                value={settings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </SettingsSection>

        {/* Security Section - Placeholder for Supabase */}
        <SettingsSection
          title="Security"
          description="Manage password and authentication settings"
        >
          <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
            <p className="text-sm text-slate-400">
              Password management and two-factor authentication will be available when connected to Supabase.
            </p>
            <button
              disabled
              className="mt-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-400 opacity-50 cursor-not-allowed"
            >
              Change Password (Coming Soon)
            </button>
          </div>
        </SettingsSection>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="sticky bottom-6 mt-8 flex items-center justify-end gap-3 rounded-lg border border-slate-800/50 bg-slate-950/95 p-4 shadow-xl backdrop-blur-sm">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
