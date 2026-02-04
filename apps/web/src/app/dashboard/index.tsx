import { createFileRoute } from "@tanstack/react-router";

import { CreateKeyForm } from "@/components";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="py-[10dvh] w-full">
      <div className="max-w-xl w-full mx-auto">
        <CreateKeyForm />
      </div>
    </div>
  );
}
