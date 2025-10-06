"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleSettingProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function ToggleSetting({
  label,
  description,
  enabled,
  onChange,
  disabled,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
          enabled ? "bg-blue-500" : "bg-slate-700"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
