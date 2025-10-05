import { ChatterPerformance } from "@/components/dashboard/chatter-performance";

export default function ChattersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chatters</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor chatter performance and metrics
          </p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
          Add Chatter
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <ChatterPerformance />
      </div>
    </div>
  );
}
