import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { MetricCard } from "@/components/dashboard/metric-card";

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revenue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your earnings and financial metrics
        </p>
      </div>

      {/* Revenue Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="This Month"
          value="$12,450"
          change="+15.3%"
          trend="up"
        />
        <MetricCard
          title="Last Month"
          value="$10,800"
          change="+8.1%"
          trend="up"
        />
        <MetricCard
          title="Avg. Per Fan"
          value="$45.20"
          change="+2.4%"
          trend="up"
        />
        <MetricCard
          title="Projected"
          value="$48,200"
          change="+12.0%"
          trend="up"
        />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Revenue Trends
          </h2>
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
        <RevenueChart />
      </div>

      {/* Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Revenue by Source
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subscriptions</span>
              <span className="font-semibold text-gray-900">$8,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tips</span>
              <span className="font-semibold text-gray-900">$2,850</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages</span>
              <span className="font-semibold text-gray-900">$1,400</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Top Earners
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@topfan1</span>
              <span className="font-semibold text-gray-900">$450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@topfan2</span>
              <span className="font-semibold text-gray-900">$380</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@topfan3</span>
              <span className="font-semibold text-gray-900">$325</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
