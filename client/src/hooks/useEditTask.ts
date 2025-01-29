import { editTask } from "@/services/api/taskService";
import { UpdateTask } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditTask = (onCancel: () => void, id: string) => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["task", { id }] });

      onCancel();
    },
    onError: () => {
      toast.error("Failed to edit task");
    },
  });
};
