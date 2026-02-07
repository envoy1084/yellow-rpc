import { createContext, type PropsWithChildren, useContext } from "react";

import type { YellowClient } from "@yellow-rpc/rpc";

import { useYellow } from "@/hooks";

const YellowContext = createContext<YellowClient | null>(null);

export const YellowProvider = ({ children }: PropsWithChildren) => {
  const ws = useYellow();

  return <YellowContext.Provider value={ws}>{children}</YellowContext.Provider>;
};

export const useYellowClient = () => {
  const ws = useContext(YellowContext);
  if (!ws) throw new Error("Yellow Client not found");
  return ws;
};
