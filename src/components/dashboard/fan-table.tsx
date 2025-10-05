"use client";

const fans = [
  {
    id: 1,
    username: "@topfan1",
    totalSpent: "$1,234",
    messages: 45,
    lastActive: "2h ago",
  },
  {
    id: 2,
    username: "@topfan2",
    totalSpent: "$980",
    messages: 32,
    lastActive: "5h ago",
  },
  {
    id: 3,
    username: "@topfan3",
    totalSpent: "$756",
    messages: 28,
    lastActive: "1d ago",
  },
  {
    id: 4,
    username: "@topfan4",
    totalSpent: "$650",
    messages: 19,
    lastActive: "3d ago",
  },
];

export function FanTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Username
            </th>
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Total Spent
            </th>
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Messages
            </th>
            <th className="pb-3 text-left text-sm font-medium text-gray-500">
              Last Active
            </th>
          </tr>
        </thead>
        <tbody>
          {fans.map((fan) => (
            <tr key={fan.id} className="border-b border-gray-100">
              <td className="py-4 text-sm font-medium text-gray-900">
                {fan.username}
              </td>
              <td className="py-4 text-sm text-gray-900">{fan.totalSpent}</td>
              <td className="py-4 text-sm text-gray-900">{fan.messages}</td>
              <td className="py-4 text-sm text-gray-500">{fan.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
