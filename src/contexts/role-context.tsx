"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CREATORS } from "@/lib/mock-data";

export type UserRole = "agency_owner" | "creator" | "chatter";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedCreatorId: string | null;
  setSelectedCreatorId: (id: string) => void;
  isLoadingCreator: boolean;
  userId: string;
  userName: string;
  userHandle?: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // For testing: Start as agency_owner, allow switching
  const [role, setRoleState] = useState<UserRole>("agency_owner");
  const [selectedCreatorId, setSelectedCreatorIdState] = useState<string | null>("creator_1"); // Default to Stella Rose
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);

  // Get selected creator data
  const selectedCreator = CREATORS.find(c => c.id === selectedCreatorId);

  // Mock user data
  const userId = "user-123";
  const userName = role === "agency_owner"
    ? "Athena Peros"
    : role === "creator"
    ? selectedCreator?.displayName || "Unknown Creator"
    : "Emma Wilson";

  const userHandle = role === "creator" ? selectedCreator?.ofUsername : undefined;

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

  // Wrapper for setSelectedCreatorId with loading state
  const setSelectedCreatorId = (id: string) => {
    setIsLoadingCreator(true);
    setSelectedCreatorIdState(id);

    // Reset loading state after transition
    setTimeout(() => {
      setIsLoadingCreator(false);
    }, 400);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        selectedCreatorId,
        setSelectedCreatorId,
        isLoadingCreator,
        userId,
        userName,
        userHandle
      }}
    >
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
