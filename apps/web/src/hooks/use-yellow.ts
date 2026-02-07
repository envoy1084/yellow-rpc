/** biome-ignore-all lint/style/noNonNullAssertion: safe */
import { useEffect, useRef } from "react";

import { YellowClient } from "@yellow-rpc/rpc";

export const useYellow = () => {
  const clientRef = useRef<YellowClient | null>(null);

  if (!clientRef.current) {
    clientRef.current = new YellowClient({
      url: "wss://clearnet-sandbox.yellow.com/ws",
    });
  }

  useEffect(() => {
    const ws = clientRef.current!;
    ws.connect().catch(console.error);

    return () => {
      ws.disconnect();
    };
  }, []);

  return clientRef.current!;
};
