import { AlertList } from "@/components/dashboard/alert-list";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Stay updated with important notifications
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <AlertList />
      </div>
    </div>
  );
}
