import { createFileRoute } from "@tanstack/react-router";

const HomeComponent = () => {
  return <div className="">Hello</div>;
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
