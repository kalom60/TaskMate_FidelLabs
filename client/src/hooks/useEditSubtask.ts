import { editSubtask } from "@/services/api/taskService";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditSubtask = (onCancel: () => void) => {
  const queryClient = new QueryClient();

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

      onCancel();
    },
    onError: () => {
      toast.error("Failed to edit subtask");
    },
  });
};
