import { Task, TaskPriority } from "@/utils/types";
import TaskActions from "../task/TaskActions";
import {
  ChevronsUp,
  ChevronUp,
  List,
  MoreHorizontal,
  Paperclip,
  Plus,
} from "lucide-react";
import { Separator } from "../ui/separator";
import CreateSubtaskModal from "../subtask/CreateSubtaskModel";
import { useCreateSubtaskModal } from "@/hooks/useCreateSubtaskModal";

interface KanbanCardProps {
  task: Task;
}

const KanbanCard = ({ task }: KanbanCardProps) => {
  const { id } = task;
  const { isOpen, openModal, closeModal, handleSubmit, isPending } =
    useCreateSubtaskModal({
      id,
    });

  const priorityStyles = {
    Low: {
      color: "text-neutral-500",
      icon: null,
    },
    Medium: {
      color: "text-yellow-500",
      icon: <ChevronUp className="size-4" />,
    },
    High: {
      color: "text-red-500",
      icon: <ChevronsUp className="size-4" />,
    },
  };

  const { color, icon } = priorityStyles[task.priority as TaskPriority];

  return (
    <>
      <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-x-2">
          <p
            className={`text-xs flex flex-row items-center justify-between ${color}`}
          >
            {icon && icon} {task.priority} Priority
          </p>
          <TaskActions task={task}>
            <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
          </TaskActions>
        </div>
        <p className="text-sm line-clamp-2">{task.title}</p>
        <div className="flex items-center gap-x-1.5">
          <div className="size-1 rounded-full bg-neutral-300" />
          <p className="text-xs text-neutral-500">
            {new Date(task.dueDate).toDateString()}
          </p>
        </div>
        <Separator />
        <div className="flex items-center gap-x-4 pl-3">
          <div className="flex items-center gap-x-2 text-sm">
            <Paperclip className="size-4" />
            {task.files ? task.files.length : 0}
          </div>

          <div className="flex items-center gap-x-2 text-sm">
            <List className="size-4" />
            {task.subtasks ? task.subtasks.length : 0}
          </div>
        </div>
        <Separator />
        <div
          className="flex items-center gap-x-2 text-neutral-500 text-xs"
          onClick={openModal}
        >
          <Plus className="text-neutral-500 size-5" />
          <p>ADD SUBTASK</p>
        </div>
      </div>

      <CreateSubtaskModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreate={handleSubmit}
        isPending={isPending}
      />
    </>
  );
};

export default KanbanCard;
