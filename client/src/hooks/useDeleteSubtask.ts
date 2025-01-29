import { deleteSubtask } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteSubtask = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, subtaskId }: { id: string; subtaskId: string }) =>
      deleteSubtask(id, subtaskId),
    onSuccess: () => {
      toast.success("Subtask deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", { id }] });
    },
    onError: () => {
      toast.error("Failed to delete subtask");
    },
  });
};
