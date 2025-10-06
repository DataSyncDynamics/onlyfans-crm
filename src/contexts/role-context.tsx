"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "agency_owner" | "creator" | "chatter";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userId: string;
  userName: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // For testing: Start as agency_owner, allow switching
  const [role, setRoleState] = useState<UserRole>("agency_owner");

  // Mock user data
  const userId = "user-123";
  const userName = role === "agency_owner"
    ? "Athena Peros"
    : role === "creator"
    ? "Bella Rose (@bella_rose)"
    : "Emma Wilson (Chatter)";

  // Persist role in localStorage for testing
  useEffect(() => {
    const savedRole = localStorage.getItem("vaultcrm_test_role") as UserRole;
    if (savedRole) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("vaultcrm_test_role", newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, userId, userName }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
