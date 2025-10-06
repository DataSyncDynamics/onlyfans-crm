"use client";

import * as React from "react";
import { SettingsSection } from "@/components/settings/settings-section";
import { FormField } from "@/components/settings/form-field";
import {
  getAgencySettings,
  saveAgencySettings,
  type AgencySettings,
} from "@/lib/settings-storage";
import { Building2, Save, X, Users } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AgencySettingsPage() {
  const [settings, setSettings] = React.useState<AgencySettings>(getAgencySettings());
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const handleChange = (key: keyof AgencySettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleBusinessHoursChange = (
    key: keyof AgencySettings["businessHours"],
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    saveAgencySettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
    }, 500);
  };

  const handleReset = () => {
    setSettings(getAgencySettings());
    setHasChanges(false);
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Building2 className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Agency Settings</h2>
            <p className="text-sm text-slate-400">
              Manage your agency information and business preferences
            </p>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-8">
        {/* Business Information */}
        <SettingsSection
          title="Business Information"
          description="Your agency details and contact information"
        >
          <div className="space-y-4">
            <FormField
              label="Agency Name"
              description="The name of your agency"
              required
            >
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="My Agency"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Contact Email"
                description="Primary contact email"
                required
              >
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="contact@agency.com"
                />
              </FormField>

              <FormField label="Phone Number" description="Contact phone number">
                <input
                  type="tel"
                  value={settings.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="+1 (555) 123-4567"
                />
              </FormField>
            </div>

            <FormField label="Website" description="Your agency website URL">
              <input
                type="url"
                value={settings.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://myagency.com"
              />
            </FormField>

            <FormField label="Business Address" description="Physical address (optional)">
              <textarea
                value={settings.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="123 Main St, City, State 12345"
              />
            </FormField>
          </div>
        </SettingsSection>

        {/* Business Settings */}
        <SettingsSection
          title="Business Settings"
          description="Configure default business rules and hours"
        >
          <div className="space-y-4">
            <FormField
              label="Default Commission Rate"
              description="Standard commission percentage for creators"
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={settings.defaultCommission}
                  onChange={(e) =>
                    handleChange("defaultCommission", Number(e.target.value))
                  }
                  className="w-32 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-slate-400">%</span>
              </div>
            </FormField>

            <FormField
              label="Business Hours"
              description="Standard operating hours for support and chatters"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.businessHours.start}
                    onChange={(e) =>
                      handleBusinessHoursChange("start", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.businessHours.end}
                    onChange={(e) =>
                      handleBusinessHoursChange("end", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </FormField>

            <FormField
              label="Fiscal Year Start"
              description="Month when your fiscal year begins"
            >
              <select
                value={settings.fiscalYearStart}
                onChange={(e) =>
                  handleChange("fiscalYearStart", Number(e.target.value))
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </SettingsSection>

        {/* Team Management - Placeholder */}
        <SettingsSection
          title="Team Management"
          description="Manage team members and permissions"
        >
          <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">
                  Multi-User Support Coming Soon
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Team member invitations, role-based permissions, and collaboration features will be available when connected to Supabase.
                </p>
                <button
                  disabled
                  className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-400 opacity-50 cursor-not-allowed"
                >
                  Invite Team Members (Coming Soon)
                </button>
              </div>
            </div>
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
