import { editSubtask } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditSubtask = (onCancel: () => void, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      subtaskId,
      subtask,
    }: {
      id: string;
      subtaskId: string;
      subtask: { title: string };
    }) => editSubtask(id, subtaskId, subtask),
    onSuccess: () => {
      toast.success("Subtask edited");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", { id }] });

      onCancel();
    },
    onError: () => {
      toast.error("Failed to edit subtask");
    },
  });
};
