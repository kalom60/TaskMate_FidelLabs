import { addTaskFile } from "@/services/api/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddTaskFile = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, id }: { formData: FormData; id: string }) =>
      addTaskFile(id, formData),
    onSuccess: () => {
      toast.success("File added");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", { id }] });
    },
    onError: () => {
      toast.error("Failed to add file");
    },
  });
};
