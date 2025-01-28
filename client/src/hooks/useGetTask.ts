import { getTask } from "@/services/api/taskService";
import { useQuery } from "@tanstack/react-query";

export const useGetTask = (id: string) => {
  const query = useQuery({
    queryKey: ["task", { id }],
    queryFn: () => getTask(id),
  });

  return query;
};
