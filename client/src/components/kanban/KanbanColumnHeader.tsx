import { TaskStatus } from "@/utils/types";
import {
  CircleCheckIcon,
  CircleDotDashedIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import CreateTaskModal from "../task/CreateTaskModal";
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.NOT_STARTED]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.COMPLETED]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
};

const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const { isOpen, openModal, closeModal, handleSubmit, isPending } =
    useCreateTaskModal();
  const icon = statusIconMap[board];

  return (
    <>
      <div className="px-2 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {icon}
          <h2 className="text-sm font-medium">{board}</h2>
          <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
            {taskCount}
          </div>
        </div>
        <Button
          onClick={openModal}
          variant={"ghost"}
          size={"icon"}
          className="size-5"
        >
          <PlusIcon className="size-4 text-neutral-500" />
        </Button>
      </div>

      <CreateTaskModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreate={handleSubmit}
        isPending={isPending}
        status={board}
      />
    </>
  );
};

export default KanbanColumnHeader;
