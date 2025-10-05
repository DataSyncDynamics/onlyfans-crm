import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { FanTable } from "@/components/dashboard/fan-table";
import { AlertList } from "@/components/dashboard/alert-list";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="$45,231"
          change="+12.5%"
          trend="up"
        />
        <MetricCard
          title="Active Fans"
          value="2,345"
          change="+8.2%"
          trend="up"
        />
        <MetricCard
          title="Messages"
          value="1,234"
          change="-3.1%"
          trend="down"
        />
        <MetricCard
          title="Conversion Rate"
          value="3.2%"
          change="+0.5%"
          trend="up"
        />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Revenue Overview
        </h2>
        <RevenueChart />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Top Fans
          </h2>
          <FanTable />
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Recent Alerts
          </h2>
          <AlertList />
        </div>
      </div>
    </div>
  );
}
