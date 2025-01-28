import { deleteTask } from "@/services/api/taskService";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTask = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTask(id),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
};
