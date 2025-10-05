import { FanTable } from "@/components/dashboard/fan-table";

export default function FansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all your fans
          </p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
          Add Fan
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <FanTable />
      </div>
    </div>
  );
}
