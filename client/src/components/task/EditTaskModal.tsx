import { Task, UpdateTask } from "@/utils/types";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import EditTaskForm from "./EditTaskForm";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updatedTask: UpdateTask) => void;
  isPending: boolean;
  task: Task;
}

const EditTaskModal = ({
  isOpen,
  onEdit,
  onClose,
  isPending,
  task,
}: EditTaskModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
        <DialogTitle></DialogTitle>
        <EditTaskForm
          task={task}
          onEdit={onEdit}
          onClose={onClose}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
