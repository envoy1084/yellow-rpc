import { createFileRoute } from "@tanstack/react-router";

import { CreateSession } from "@/components/create-session";
import { Button } from "@/components/ui/button";
import { useAuthenticate } from "@/hooks";
import { useYellowClient } from "@/providers/yellow";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { getSigner, authenticate } = useAuthenticate();
  const ws = useYellowClient();

  return (
    <div className="py-[10dvh] w-full">
      <div className="max-w-3xl w-full mx-auto  px-4">
        <Button
          onClick={async () => {
            await authenticate();
          }}
        >
          Authenticate
        </Button>
        <Button
          onClick={async () => {
            const sessionId =
              "0xdbe4043879d0314fe03b958461cf3b6d4b5a1e2ac304285755303e195f25b078";
            const signer = await getSigner();
            const res = await ws.getLedgerBalance(signer, sessionId);
            console.log(res);
          }}
        >
          Get App Session
        </Button>
        <CreateSession />
        <div className="flex flex-row items-center gap-2 justify-between">
          <div>API Keys</div>
        </div>
      </div>
    </div>
  );
}
