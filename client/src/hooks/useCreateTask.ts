import { createTask } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCreateTaskOptions {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useCreateTask = ({
  onSuccess,
  onCancel,
}: UseCreateTaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      if (onSuccess) {
        onSuccess();
      }

      if (onCancel) {
        onCancel();
      }
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
};
