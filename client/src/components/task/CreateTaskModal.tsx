import { TaskStatus } from "@/utils/types";
import CreateTaskForm from "./CreateTaskForm";
import { Dialog, DialogContent } from "../ui/dialog";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: TaskStatus;
}

const CreateTaskModal = ({
  open,
  onOpenChange,
  status,
}: CreateTaskModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
        <CreateTaskForm status={status} onCancel={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
