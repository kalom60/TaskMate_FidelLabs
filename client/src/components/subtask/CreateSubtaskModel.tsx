import { Dialog, DialogContent } from "../ui/dialog";
import CreateSubtaskForm from "./CreateSubtaskForm";

interface CreateSubtaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (subtask: { title: string }) => void;
  isPending: boolean;
}

const CreateSubtaskModal = ({
  isOpen,
  onCreate,
  onClose,
  isPending,
}: CreateSubtaskModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[40vh]">
        <CreateSubtaskForm
          onCreate={onCreate}
          onClose={onClose}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubtaskModal;
