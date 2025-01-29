import { editTask } from "@/services/api/taskService";
import { UpdateTask } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseEditTaskOptions {
  id: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useEditTask = ({
  id,
  onSuccess,
  onCancel,
}: UseEditTaskOptions) => {
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

      if (onSuccess) {
        onSuccess();
      }

      if (onCancel) {
        onCancel();
      }
    },
    onError: () => {
      toast.error("Failed to edit task");
    },
  });
};
