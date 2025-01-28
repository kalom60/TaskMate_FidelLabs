import { getTasks } from "@/services/api/taskService";
import { useQuery } from "@tanstack/react-query";

export const useGetTasks = () => {
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return query;
};
