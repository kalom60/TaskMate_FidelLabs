import { deleteFile } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTaskFile = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, fileId }: { taskId: string; fileId: string }) =>
      deleteFile(taskId, fileId),
    onSuccess: () => {
      toast.success("File deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", { id }] });
    },
    onError: () => {
      toast.error("Failed to delete file");
    },
  });
};
