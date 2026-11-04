import { useEffect, useState } from "react";
import { secondsBetween } from "../lib/format";

/** Seconds since `startedAt` (server time). Stops ticking once `endedAt` is set. */
export function useElapsed(startedAt: string, endedAt: string | null) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (endedAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [endedAt]);

  return secondsBetween(startedAt, endedAt ?? now);
}
