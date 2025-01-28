import { useGetTask } from "@/hooks/useGetTask";
import { Loader } from "lucide-react";
import TaskOverview from "./TaskOverview";
import SubtaskOverview from "../subtask/SubtaskOverview";
import TaskFileOverview from "../file/TaskFileOverview";

interface TaskProps {
  id: string;
}

const Task = ({ id }: TaskProps) => {
  const { data: task, isLoading } = useGetTask(id);

  return (
    <div className="ml-20 mr-20 mt-10">
      {isLoading ? (
        <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TaskOverview task={task} />
            <SubtaskOverview id={task.id} subtasks={task.subtasks} />
          </div>

          <div className="mt-5">
            <TaskFileOverview files={task.files} />
          </div>
        </>
      )}
    </div>
  );
};

export default Task;
