import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Subtask } from "@/utils/types";
import EditSubtaskModal from "./EditSubtaskModal";
import DeleteConfirmation from "../kanban/DeleteConfirmation";
import { useDeleteSubtask } from "@/hooks/useDeleteSubtask";

interface SubtaskActionsProps {
  id: string;
  subtask: Subtask;
  children: React.ReactNode;
}

const SubtaskActions = ({ id, subtask, children }: SubtaskActionsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const { mutate } = useDeleteSubtask();

  const onDelete = () => {
    mutate(
      { id, subtaskId: subtask.id },
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
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Subtask
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setAlertOpen(true)}
            disabled={false}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Subtask
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSubtaskModal
        open={open}
        onOpenChange={() => setOpen(false)}
        id={id}
        subtask={subtask}
      />

      <DeleteConfirmation
        open={alertOpen}
        title={"Delete subtask"}
        message={
          "This action cannot be undone. This will permanently delete the subtask."
        }
        onOpenChange={() => setAlertOpen(false)}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default SubtaskActions;
