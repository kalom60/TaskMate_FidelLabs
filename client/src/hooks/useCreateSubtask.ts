import { createSubtask } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCreateSubtaskOptions {
  onSuccess?: () => void;
  onCancel?: () => void;
  id: string;
}

export const useCreateSubtask = ({
  onSuccess,
  onCancel,
  id,
}: UseCreateSubtaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subtask, id }: { subtask: { title: string }; id: string }) =>
      createSubtask(subtask, id),
    onSuccess: () => {
      toast.success("Subtask created");
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
      toast.error("Failed to create subtask");
    },
  });
};
