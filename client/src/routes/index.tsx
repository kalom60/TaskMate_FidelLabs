import Tasks from "@/components/task/Tasks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className=" mr-20 ml-20">
      <Tasks />
    </div>
  );
}
