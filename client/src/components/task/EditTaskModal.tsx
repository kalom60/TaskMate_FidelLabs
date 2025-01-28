import { Task } from "@/utils/types";
import { Dialog, DialogContent } from "../ui/dialog";
import EditTaskForm from "./EditTaskForm";

interface EditTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

const EditTaskModal = ({ open, onOpenChange, task }: EditTaskModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
        <EditTaskForm task={task} onCancel={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
