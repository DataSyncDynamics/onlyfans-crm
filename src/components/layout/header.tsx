"use client";

import { Bell, Settings, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center space-x-4">
        <input
          type="search"
          placeholder="Search..."
          className="w-64 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
        <button className="flex items-center space-x-2 rounded-full bg-gray-100 p-2 hover:bg-gray-200">
          <User className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
