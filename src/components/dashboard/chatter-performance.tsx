"use client";

const chatters = [
  {
    id: 1,
    name: "Sarah M.",
    messages: 234,
    revenue: "$4,520",
    conversion: "12.5%",
    status: "active",
  },
  {
    id: 2,
    name: "Alex K.",
    messages: 189,
    revenue: "$3,890",
    conversion: "10.8%",
    status: "active",
  },
  {
    id: 3,
    name: "Jamie L.",
    messages: 156,
    revenue: "$2,340",
    conversion: "8.2%",
    status: "break",
  },
];

export function ChatterPerformance() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Name
            </th>
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Messages
            </th>
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Revenue
            </th>
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Conversion
            </th>
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {chatters.map((chatter) => (
            <tr key={chatter.id} className="border-b border-gray-100">
              <td className="py-4 text-sm font-medium text-gray-900">
                {chatter.name}
              </td>
              <td className="py-4 text-sm text-gray-900">
                {chatter.messages}
              </td>
              <td className="py-4 text-sm text-gray-900">{chatter.revenue}</td>
              <td className="py-4 text-sm text-gray-900">
                {chatter.conversion}
              </td>
              <td className="py-4 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    chatter.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {chatter.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
