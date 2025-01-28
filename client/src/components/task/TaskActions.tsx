import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import EditTaskModal from "./EditTaskModal";
import { Task } from "@/utils/types";
import DeleteConfirmation from "../kanban/DeleteConfirmation";
import { useDeleteTask } from "@/hooks/useDeleteTask";

interface TaskActionsProps {
  task: Task;
  children: React.ReactNode;
}

const TaskActions = ({ task, children }: TaskActionsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const { mutate } = useDeleteTask();

  const onDelete = () => {
    mutate(
      { id: task.id },
      {
        onSuccess: () => {
          setAlertOpen(false);
        },
      }
    );
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <Link
            to="/$taskId"
            params={{
              taskId: task.id,
            }}
          >
            <DropdownMenuItem
              onClick={() => {}}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Task Details
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setAlertOpen(true)}
            disabled={false}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTaskModal
        open={open}
        onOpenChange={() => setOpen(false)}
        task={task}
      />

      <DeleteConfirmation
        open={alertOpen}
        title={"Delete task"}
        message={
          "This action cannot be undone. This will permanently delete the task."
        }
        onOpenChange={() => setAlertOpen(false)}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default TaskActions;
