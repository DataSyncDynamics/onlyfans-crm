export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage campaigns and promotional content
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Active Campaigns
          </h2>
          <p className="text-sm text-gray-500">No active campaigns</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Scheduled Posts
          </h2>
          <p className="text-sm text-gray-500">No scheduled posts</p>
        </div>
      </div>
    </div>
  );
}
