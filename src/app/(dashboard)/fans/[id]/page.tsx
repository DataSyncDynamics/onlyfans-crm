export default function FanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fan Details</h1>
        <p className="mt-1 text-sm text-gray-500">Fan ID: {params.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fan Info */}
        <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Information
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Username
              </span>
              <p className="mt-1 text-gray-900">@user{params.id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Total Spent
              </span>
              <p className="mt-1 text-gray-900">$1,234</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Member Since
              </span>
              <p className="mt-1 text-gray-900">January 2024</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-2 text-sm font-medium text-gray-500">
              Messages
            </h3>
            <p className="text-2xl font-bold text-gray-900">156</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-2 text-sm font-medium text-gray-500">
              Tips
            </h3>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
