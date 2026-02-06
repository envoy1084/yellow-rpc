import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useAuthenticate } from "@/hooks";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authenticate } = useAuthenticate();

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
        <div className="flex flex-row items-center gap-2 justify-between">
          <div>API Keys</div>
        </div>
      </div>
    </div>
  );
}
