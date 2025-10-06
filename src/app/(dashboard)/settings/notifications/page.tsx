"use client";

import * as React from "react";
import { SettingsSection } from "@/components/settings/settings-section";
import { FormField } from "@/components/settings/form-field";
import { ToggleSetting } from "@/components/settings/toggle-setting";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/settings-storage";
import { Bell, Save, X } from "lucide-react";

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = React.useState<NotificationPreferences>(
    getNotificationPreferences()
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const handleToggleAlertType = (type: keyof NotificationPreferences["alertTypes"]) => {
    setPreferences((prev) => ({
      ...prev,
      alertTypes: {
        ...prev.alertTypes,
        [type]: !prev.alertTypes[type],
      },
    }));
    setHasChanges(true);
  };

  const handleToggleChannel = (channel: keyof NotificationPreferences["channels"]) => {
    setPreferences((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel],
      },
    }));
    setHasChanges(true);
  };

  const handleThresholdChange = (
    key: keyof NotificationPreferences["thresholds"],
    value: number | string[]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleQuietHoursChange = (
    key: keyof NotificationPreferences["quietHours"],
    value: boolean | string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleToggleSound = () => {
    setPreferences((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    setHasChanges(true);
  };

  const handleToggleBadge = () => {
    setPreferences((prev) => ({ ...prev, badgeEnabled: !prev.badgeEnabled }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    saveNotificationPreferences(preferences);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
    }, 500);
  };

  const handleReset = () => {
    setPreferences(getNotificationPreferences());
    setHasChanges(false);
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
            <Bell className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Notification Preferences
            </h2>
            <p className="text-sm text-slate-400">
              Customize when and how you receive alerts
            </p>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-8">
        {/* Alert Types */}
        <SettingsSection
          title="Alert Types"
          description="Choose which types of notifications you want to receive"
        >
          <div className="space-y-2">
            <ToggleSetting
              label="Revenue Alerts"
              description="Tips, purchases, milestones, and subscription renewals"
              enabled={preferences.alertTypes.revenue}
              onChange={() => handleToggleAlertType("revenue")}
            />
            <ToggleSetting
              label="Message Alerts"
              description="New messages from fans and chatter activity"
              enabled={preferences.alertTypes.message}
              onChange={() => handleToggleAlertType("message")}
            />
            <ToggleSetting
              label="Chat Alerts"
              description="Chatter performance updates and shift reminders"
              enabled={preferences.alertTypes.chat}
              onChange={() => handleToggleAlertType("chat")}
            />
            <ToggleSetting
              label="Warning Alerts"
              description="Whale inactivity, churn risks, and performance issues"
              enabled={preferences.alertTypes.warning}
              onChange={() => handleToggleAlertType("warning")}
            />
            <ToggleSetting
              label="Info Alerts"
              description="System updates, maintenance, and general information"
              enabled={preferences.alertTypes.info}
              onChange={() => handleToggleAlertType("info")}
            />
          </div>
        </SettingsSection>

        {/* Notification Channels */}
        <SettingsSection
          title="Notification Channels"
          description="Select how you want to receive notifications"
        >
          <div className="space-y-2">
            <ToggleSetting
              label="In-App Notifications"
              description="Show notifications in the application"
              enabled={preferences.channels.inApp}
              onChange={() => handleToggleChannel("inApp")}
              disabled={true}
            />
            <ToggleSetting
              label="Email Notifications"
              description="Receive notifications via email (coming soon)"
              enabled={preferences.channels.email}
              onChange={() => handleToggleChannel("email")}
              disabled={true}
            />
            <ToggleSetting
              label="Push Notifications"
              description="Browser push notifications (coming soon)"
              enabled={preferences.channels.push}
              onChange={() => handleToggleChannel("push")}
              disabled={true}
            />
            <ToggleSetting
              label="SMS Notifications"
              description="Text message alerts for critical events (coming soon)"
              enabled={preferences.channels.sms}
              onChange={() => handleToggleChannel("sms")}
              disabled={true}
            />
          </div>
        </SettingsSection>

        {/* Thresholds */}
        <SettingsSection
          title="Alert Thresholds"
          description="Set minimum values for triggering certain alerts"
        >
          <div className="space-y-4">
            <FormField
              label="Revenue Alert Minimum"
              description="Only alert for tips and purchases above this amount"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={preferences.thresholds.revenueMinimum}
                  onChange={(e) =>
                    handleThresholdChange("revenueMinimum", Number(e.target.value))
                  }
                  className="w-32 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </FormField>

            <FormField
              label="Fan Tier Alerts"
              description="Only alert for these fan tiers"
            >
              <div className="flex flex-wrap gap-2">
                {["whale", "high", "medium", "low"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      const currentTiers = preferences.thresholds.fanTiers;
                      const newTiers = currentTiers.includes(tier)
                        ? currentTiers.filter((t) => t !== tier)
                        : [...currentTiers, tier];
                      handleThresholdChange("fanTiers", newTiers);
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      preferences.thresholds.fanTiers.includes(tier)
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField
              label="Message Volume Alert"
              description="Alert when unread messages exceed this number"
            >
              <input
                type="number"
                min="1"
                step="5"
                value={preferences.thresholds.messageVolume}
                onChange={(e) =>
                  handleThresholdChange("messageVolume", Number(e.target.value))
                }
                className="w-32 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </FormField>
          </div>
        </SettingsSection>

        {/* Quiet Hours */}
        <SettingsSection
          title="Quiet Hours"
          description="Pause non-critical notifications during specific times"
        >
          <ToggleSetting
            label="Enable Quiet Hours"
            description="Mute notifications during your set hours"
            enabled={preferences.quietHours.enabled}
            onChange={() =>
              handleQuietHoursChange("enabled", !preferences.quietHours.enabled)
            }
          />

          {preferences.quietHours.enabled && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Start Time" description="When quiet hours begin">
                <input
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) => handleQuietHoursChange("start", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </FormField>

              <FormField label="End Time" description="When quiet hours end">
                <input
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) => handleQuietHoursChange("end", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </FormField>
            </div>
          )}
        </SettingsSection>

        {/* Sound & Badge */}
        <SettingsSection
          title="Sound & Badge"
          description="Visual and audio notification settings"
        >
          <div className="space-y-2">
            <ToggleSetting
              label="Notification Sounds"
              description="Play a sound when new notifications arrive"
              enabled={preferences.soundEnabled}
              onChange={handleToggleSound}
            />
            <ToggleSetting
              label="Badge Count"
              description="Show unread count on notification bell"
              enabled={preferences.badgeEnabled}
              onChange={handleToggleBadge}
            />
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
