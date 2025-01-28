import { editTask } from "@/services/api/taskService";
import { UpdateTask } from "@/utils/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditTask = (onCancel: () => void) => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: ({
      updatedTask,
      id,
    }: {
      updatedTask: UpdateTask;
      id: string;
    }) => editTask(updatedTask, id),
    onSuccess: () => {
      toast.success("Task edited");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      onCancel();
    },
    onError: () => {
      toast.error("Failed to edit task");
    },
  });
};
