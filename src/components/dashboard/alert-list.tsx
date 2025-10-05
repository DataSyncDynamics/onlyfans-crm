"use client";

import { Bell, TrendingUp, MessageSquare, AlertCircle } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "revenue",
    message: "Revenue milestone reached: $10,000",
    time: "2h ago",
    icon: TrendingUp,
  },
  {
    id: 2,
    type: "message",
    message: "New high-value fan joined",
    time: "5h ago",
    icon: Bell,
  },
  {
    id: 3,
    type: "chat",
    message: "Chatter needs assistance with @topfan1",
    time: "1d ago",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "warning",
    message: "Payment method expiring soon",
    time: "2d ago",
    icon: AlertCircle,
  },
];

export function AlertList() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const Icon = alert.icon;
        return (
          <div
            key={alert.id}
            className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4"
          >
            <div className="rounded-full bg-blue-100 p-2">
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {alert.message}
              </p>
              <p className="text-xs text-gray-500">{alert.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
