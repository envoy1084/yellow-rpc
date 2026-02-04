import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="py-[10dvh] w-full">
      <div className="max-w-3xl w-full mx-auto  px-4">
        {/* <CreateKeyForm /> */}
        <div className="flex flex-row items-center gap-2 justify-between">
          <div>API Keys</div>
        </div>
      </div>
    </div>
  );
}
