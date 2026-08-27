import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Reads and increments the public download counter for an app.
 * Counting happens server-side via a database function, so the number
 * is shared across all visitors.
 */
export const useAppDownloads = (appSlug = "filtertube") => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("app_download_counters")
        .select("downloads")
        .eq("app_slug", appSlug)
        .maybeSingle();
      if (error) {
        console.error("[downloads] failed to load counter:", error.message);
        return;
      }
      if (active) setCount(Number(data?.downloads ?? 0));
    })();
    return () => { active = false; };
  }, [appSlug]);

  const registerDownload = useCallback(async () => {
    setCount((c) => (c === null ? c : c + 1));
    const { data, error } = await supabase.rpc("increment_app_download", { _app_slug: appSlug });
    if (error) {
      console.error("[downloads] failed to increment counter:", error.message);
      return;
    }
    if (data !== null && data !== undefined) setCount(Number(data));
  }, [appSlug]);

  return { count, registerDownload };
};
