"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectOnlyFansWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (config: ConnectionConfig) => void;
}

interface ConnectionConfig {
  username: string;
  apiKey: string;
  syncSettings: {
    messages: boolean;
    subscribers: boolean;
    revenue: boolean;
    content: boolean;
  };
  syncInterval: "6h" | "12h" | "24h";
}

type Step = 1 | 2 | 3 | 4 | 5;

export function ConnectOnlyFansWizard({
  open,
  onOpenChange,
  onComplete,
}: ConnectOnlyFansWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<Step>(1);
  const [username, setUsername] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [syncSettings, setSyncSettings] = React.useState({
    messages: true,
    subscribers: true,
    revenue: true,
    content: true,
  });
  const [syncInterval, setSyncInterval] = React.useState<"6h" | "12h" | "24h">(
    "12h"
  );
  const [isTestingConnection, setIsTestingConnection] = React.useState(false);
  const [connectionTestResult, setConnectionTestResult] = React.useState<
    "success" | "error" | null
  >(null);

  React.useEffect(() => {
    if (!open) {
      // Reset wizard state when closed
      setCurrentStep(1);
      setUsername("");
      setApiKey("");
      setSyncSettings({
        messages: true,
        subscribers: true,
        revenue: true,
        content: true,
      });
      setSyncInterval("12h");
      setIsTestingConnection(false);
      setConnectionTestResult(null);
    }
  }, [open]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (in production, this would be a real API call)
    const success = apiKey.length >= 10; // Simple validation
    setConnectionTestResult(success ? "success" : "error");
    setIsTestingConnection(false);

    if (success) {
      setTimeout(() => {
        handleComplete();
      }, 1500);
    }
  };

  const handleComplete = () => {
    const config: ConnectionConfig = {
      username,
      apiKey,
      syncSettings,
      syncInterval,
    };
    onComplete(config);
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return username.length > 0;
      case 2:
        return apiKey.length >= 10;
      case 3:
        return Object.values(syncSettings).some((v) => v);
      case 4:
        return true;
      case 5:
        return connectionTestResult === "success";
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: "Username" },
    { number: 2, title: "API Key" },
    { number: 3, title: "Sync Settings" },
    { number: 4, title: "Sync Interval" },
    { number: 5, title: "Test & Confirm" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Connect OnlyFans Account
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all",
                      currentStep > step.number
                        ? "bg-purple-600 border-purple-600"
                        : currentStep === step.number
                        ? "bg-purple-600 border-purple-600"
                        : "bg-slate-800 border-slate-700"
                    )}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 transition-all",
                      currentStep > step.number
                        ? "bg-purple-600"
                        : "bg-slate-800"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="py-6 min-h-[300px]">
          {/* Step 1: Username */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Enter OnlyFans Username
                </h3>
                <p className="text-sm text-slate-400">
                  Enter the username of the OnlyFans creator account you want
                  to connect.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="@username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: API Key */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Enter API Key
                </h3>
                <p className="text-sm text-slate-400">
                  You'll need an OnlyFans API key to enable data syncing.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-12"
                  autoFocus
                />
              </div>
              <a
                href="https://onlyfans.com/api-settings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                How to get your API key
              </a>
            </div>
          )}

          {/* Step 3: Sync Settings */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Configure Sync Settings
                </h3>
                <p className="text-sm text-slate-400">
                  Choose which data types to sync from OnlyFans.
                </p>
              </div>
              <div className="space-y-3">
                {Object.entries({
                  messages: "Messages",
                  subscribers: "Subscribers",
                  revenue: "Revenue & Transactions",
                  content: "Content & Media",
                }).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 p-4"
                  >
                    <Label
                      htmlFor={key}
                      className="text-sm font-medium text-slate-200 cursor-pointer"
                    >
                      {label}
                    </Label>
                    <Checkbox
                      id={key}
                      checked={
                        syncSettings[key as keyof typeof syncSettings]
                      }
                      onCheckedChange={(checked) =>
                        setSyncSettings((prev) => ({
                          ...prev,
                          [key]: checked === true,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Sync Interval */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Set Sync Interval
                </h3>
                <p className="text-sm text-slate-400">
                  How often should we automatically sync your OnlyFans data?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="syncInterval">Sync Interval</Label>
                <Select
                  value={syncInterval}
                  onValueChange={(value: "6h" | "12h" | "24h") =>
                    setSyncInterval(value)
                  }
                >
                  <SelectTrigger id="syncInterval" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6h">Every 6 hours</SelectItem>
                    <SelectItem value="12h">Every 12 hours</SelectItem>
                    <SelectItem value="24h">Every 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-blue-950/30 border border-blue-900/50 p-4">
                <p className="text-sm text-blue-400">
                  You can change this setting anytime from the connection
                  settings.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Test Connection */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Test Connection
                </h3>
                <p className="text-sm text-slate-400">
                  Let's verify your OnlyFans connection before completing setup.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Username</span>
                  <span className="text-white font-medium">@{username}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">API Key</span>
                  <span className="text-white font-mono">
                    {"•".repeat(apiKey.length - 4) + apiKey.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Sync Interval</span>
                  <span className="text-white font-medium">
                    Every {syncInterval.replace("h", " hours")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Data Types</span>
                  <span className="text-white font-medium">
                    {Object.values(syncSettings).filter(Boolean).length} selected
                  </span>
                </div>
              </div>

              {connectionTestResult === null && !isTestingConnection && (
                <Button
                  onClick={handleTestConnection}
                  className="w-full min-h-[44px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Test Connection
                </Button>
              )}

              {isTestingConnection && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto" />
                    <p className="text-sm text-slate-400">
                      Testing connection...
                    </p>
                  </div>
                </div>
              )}

              {connectionTestResult === "success" && (
                <div className="rounded-lg bg-emerald-950/30 border border-emerald-900/50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">
                        Connection Successful
                      </p>
                      <p className="text-sm text-emerald-400/80 mt-1">
                        Your OnlyFans account is connected and ready to sync.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {connectionTestResult === "error" && (
                <div className="rounded-lg bg-red-950/30 border border-red-900/50 p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-400">
                        Connection Failed
                      </p>
                      <p className="text-sm text-red-400/80 mt-1">
                        Unable to connect. Please check your credentials and try
                        again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="min-h-[44px] bg-slate-800/50 border-slate-700 hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-h-[44px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            connectionTestResult === "success" && (
              <Button
                onClick={handleComplete}
                className="min-h-[44px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Complete Setup
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
