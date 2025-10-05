"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useRealtime<T>(
  table: string,
  filter?: string
): { data: T[]; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    async function setupRealtime() {
      try {
        // Initial fetch
        let query = supabase.from(table).select("*");
        if (filter) {
          query = query.filter(filter, "eq", true);
        }

        const { data: initialData, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setData((initialData as T[]) || []);
        setLoading(false);

        // Subscribe to realtime updates
        channel = supabase
          .channel(`${table}-changes`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: table,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setData((current) => [...current, payload.new as T]);
              } else if (payload.eventType === "UPDATE") {
                setData((current) =>
                  current.map((item) =>
                    (item as { id: string }).id === (payload.new as { id: string }).id
                      ? (payload.new as T)
                      : item
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setData((current) =>
                  current.filter((item) => (item as { id: string }).id !== (payload.old as { id: string }).id)
                );
              }
            }
          )
          .subscribe();
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter]);

  return { data, loading, error };
}
