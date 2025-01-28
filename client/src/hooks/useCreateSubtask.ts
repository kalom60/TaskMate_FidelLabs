import { createSubtask } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCreateSubtaskOptions {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useCreateSubtask = ({
  onSuccess,
  onCancel,
}: UseCreateSubtaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subtask, id }: { subtask: { title: string }; id: string }) =>
      createSubtask(subtask, id),
    onSuccess: () => {
      toast.success("Subtask created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Call the onCancel callback if provided
      if (onCancel) {
        onCancel();
      }
    },
    onError: () => {
      toast.error("Failed to create subtask");
    },
  });
};
