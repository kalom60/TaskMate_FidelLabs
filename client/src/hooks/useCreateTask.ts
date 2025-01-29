import { createTask } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateTask = (onCancel: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      onCancel();
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
};
