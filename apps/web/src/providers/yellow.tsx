import { createContext, type PropsWithChildren, useContext } from "react";

import type { YellowClient } from "@yellow-rpc/rpc";

import { useUnifiedBalance, useYellow, useYellowEvents } from "@/hooks";

const YellowContext = createContext<YellowClient | null>(null);

export const YellowProvider = ({ children }: PropsWithChildren) => {
  const ws = useYellow();

  return (
    <YellowContext.Provider value={ws}>
      <YellowWrapper>{children}</YellowWrapper>
    </YellowContext.Provider>
  );
};

const YellowWrapper = ({ children }: PropsWithChildren) => {
  useYellowEvents();
  useUnifiedBalance();
  return <>{children}</>;
};

export const useYellowClient = () => {
  const ws = useContext(YellowContext);
  if (!ws) throw new Error("Yellow Client not found");
  return ws;
};
