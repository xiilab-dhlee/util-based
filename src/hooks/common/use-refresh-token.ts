import type { Session } from "next-auth";
import { useEffect, useRef } from "react";

export const useRefreshToken = ({
  session,
  update,
}: {
  session: Session | null;
  update: (data?: Session | null) => Promise<Session | null>;
}) => {
  const interval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    const watchAndUpdateIfExpire = () => {
      if (session) {
        const nowTime = Math.floor(Date.now() / 1000);
        const timeRemaining = Number(session?.expires) - nowTime; // unix timestamp

        if (timeRemaining <= 0) update();
      }
    };

    interval.current = setInterval(watchAndUpdateIfExpire, 1000 * 10);

    return () => clearInterval(interval.current);
  }, [session, update]);

  return null;
};
