import { deleteSubtask } from "@/services/api/taskService";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteSubtask = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: ({ id, subtaskId }: { id: string; subtaskId: string }) =>
      deleteSubtask(id, subtaskId),
    onSuccess: () => {
      toast.success("Subtask deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to delete subtask");
    },
  });
};
