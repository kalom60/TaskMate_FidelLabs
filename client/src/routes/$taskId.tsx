import Task from "@/components/task/Task";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$taskId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.taskId,
    };
  },
});

function RouteComponent() {
  const { id } = Route.useLoaderData();

  return (
    <div>
      <Task id={id} />
    </div>
  );
}
