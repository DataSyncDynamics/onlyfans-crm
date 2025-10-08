"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Target, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FanSegmentationPanel } from "@/components/campaigns/fan-segmentation-panel";
import { MessageComposer } from "@/components/campaigns/message-composer";
import { PPVPricingSelector } from "@/components/campaigns/ppv-pricing-selector";
import { CampaignPreview } from "@/components/campaigns/campaign-preview";
import { ABTestConfigurator } from "@/components/campaigns/ab-test-configurator";
import { SendSchedulePicker } from "@/components/campaigns/send-schedule-picker";

const STEPS = [
  { id: 1, name: "Target Audience", icon: Target },
  { id: 2, name: "Create Message", icon: MessageSquare },
  { id: 3, name: "Schedule & Send", icon: Send },
];

const MOCK_CREATORS = [
  { id: "creator_1", name: "Stella Rose", avatar: "/avatars/stella.jpg" },
  { id: "creator_2", name: "Luna Vibe", avatar: "/avatars/luna.jpg" },
  { id: "creator_3", name: "Nova Night", avatar: "/avatars/nova.jpg" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Audience
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [segment, setSegment] = useState<any>(null);

  // Step 2: Message
  const [message, setMessage] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [ppvEnabled, setPPVEnabled] = useState(false);
  const [ppvPrice, setPPVPrice] = useState(35);
  const [abTestEnabled, setABTestEnabled] = useState(false);
  const [abVariants, setABVariants] = useState<any[]>([]);

  // Step 3: Schedule
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [sendRate, setSendRate] = useState<"slow" | "medium" | "fast">("medium");

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedCreators.length > 0 && segment !== null;
    }
    if (currentStep === 2) {
      return message.trim().length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLaunch = () => {
    // TODO: Create campaign
    console.log("Launching campaign:", {
      selectedCreators,
      segment,
      message,
      mediaUrls,
      ppvEnabled,
      ppvPrice,
      abTestEnabled,
      abVariants,
      scheduledDate,
      sendRate,
    });

    // Redirect to campaigns list with success toast
    router.push("/campaigns");
  };

  const handleMediaAdd = (urls: string[]) => {
    setMediaUrls([...mediaUrls, ...urls]);
  };

  const handleMediaRemove = (url: string) => {
    setMediaUrls(mediaUrls.filter((u) => u !== url));
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
        <h1 className="text-3xl font-bold text-white">Create New Campaign</h1>
        <p className="text-sm text-slate-400 mt-1">
          Set up a mass messaging campaign in 3 easy steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all
                      ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800 text-slate-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-slate-500">Step {step.id}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      isCompleted ? "bg-emerald-500" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-6xl mx-auto">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Select Creators
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {MOCK_CREATORS.map((creator) => {
                  const isSelected = selectedCreators.includes(creator.id);
                  return (
                    <button
                      key={creator.id}
                      onClick={() => {
                        setSelectedCreators(
                          isSelected
                            ? selectedCreators.filter((id) => id !== creator.id)
                            : [...selectedCreators, creator.id]
                        );
                      }}
                      className={`
                        p-4 rounded-lg border-2 transition-all
                        ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-purple-500 overflow-hidden flex-shrink-0">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-white">
                            {creator.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            @{creator.name.toLowerCase().replace(" ", "")}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Target Audience
              </h2>
              <FanSegmentationPanel
                selectedCreatorIds={selectedCreators}
                onSegmentChange={setSegment}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Compose Message
                </h2>
                <MessageComposer
                  value={message}
                  onChange={setMessage}
                  onMediaAdd={handleMediaAdd}
                  mediaUrls={mediaUrls}
                  onMediaRemove={handleMediaRemove}
                />
              </div>

              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  PPV Pricing
                </h2>
                <PPVPricingSelector
                  value={ppvPrice}
                  onChange={setPPVPrice}
                  enabled={ppvEnabled}
                  onEnabledChange={setPPVEnabled}
                />
              </div>

              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  A/B Testing
                </h2>
                <ABTestConfigurator
                  enabled={abTestEnabled}
                  onEnabledChange={setABTestEnabled}
                  variants={abVariants}
                  onVariantsChange={setABVariants}
                />
              </div>
            </div>

            <div className="sticky top-6">
              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Preview
                </h2>
                <CampaignPreview
                  message={message}
                  mediaUrls={mediaUrls}
                  ppvPrice={ppvEnabled ? ppvPrice : undefined}
                  creatorName={
                    MOCK_CREATORS.find((c) => c.id === selectedCreators[0])?.name ||
                    "Creator"
                  }
                  creatorAvatar={
                    MOCK_CREATORS.find((c) => c.id === selectedCreators[0])?.avatar ||
                    "/avatars/placeholder.jpg"
                  }
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Schedule & Send
                </h2>
                <SendSchedulePicker
                  scheduledDate={scheduledDate}
                  onScheduleChange={setScheduledDate}
                  sendRate={sendRate}
                  onSendRateChange={setSendRate}
                  targetCount={segment?.count || 0}
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Campaign Summary */}
              <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Campaign Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Creators</span>
                    <span className="text-sm text-white font-medium">
                      {selectedCreators.length} selected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Target Fans</span>
                    <span className="text-sm text-white font-medium">
                      {segment?.count || 0} fans
                    </span>
                  </div>
                  {ppvEnabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">PPV Price</span>
                        <span className="text-sm text-white font-medium">
                          ${ppvPrice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Est. Revenue</span>
                        <span className="text-lg text-emerald-400 font-bold">
                          $2,700 - $4,100
                        </span>
                      </div>
                    </>
                  )}
                  {abTestEnabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">A/B Testing</span>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {abVariants.length} variants
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Recipients */}
              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
                <h3 className="text-sm font-medium text-white mb-3">
                  Preview Recipients (Sample)
                </h3>
                <div className="space-y-2">
                  {["@mike2847", "@john4521", "@kevin5432", "@sarah9876", "@chris4521"].map(
                    (fan) => (
                      <div
                        key={fan}
                        className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50"
                      >
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                          {fan[1].toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-300">{fan}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-slate-400">
            Step {currentStep} of {STEPS.length}
          </div>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
            >
              <Send className="h-4 w-4 mr-2" />
              Launch Campaign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
