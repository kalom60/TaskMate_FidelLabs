import { TaskStatus } from "@/utils/types";
import CreateTaskForm from "./CreateTaskForm";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: FormData) => void;
  isPending: boolean;
  status?: TaskStatus;
}

const CreateTaskModal = ({
  isOpen,
  onCreate,
  onClose,
  isPending,
  status,
}: CreateTaskModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
        <DialogTitle></DialogTitle>
        <CreateTaskForm
          status={status}
          onCreate={onCreate}
          onClose={onClose}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
