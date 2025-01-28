import { Dialog, DialogContent } from "../ui/dialog";
import EditSubtaskForm from "./EditSubtaskForm";
import { Subtask } from "@/utils/types";

interface EditSubtaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  subtask: Subtask;
}

const EditSubtaskModal = ({
  open,
  onOpenChange,
  id,
  subtask,
}: EditSubtaskModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[40vh]">
        <EditSubtaskForm onCancel={onOpenChange} id={id} subtask={subtask} />
      </DialogContent>
    </Dialog>
  );
};

export default EditSubtaskModal;
