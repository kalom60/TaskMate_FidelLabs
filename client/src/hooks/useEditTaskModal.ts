import { useState } from "react";
import { useEditTask } from "./useEditTask";
import { UpdateTask } from "@/utils/types";

interface UseEditTaskModalProps {
  onSuccess?: () => void;
  id: string;
}

export const useEditTaskModal = ({ id, onSuccess }: UseEditTaskModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: editTask, isPending } = useEditTask({
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
    id,
    onCancel: () => setIsOpen(false),
  });

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const handleSubmit = (updatedTask: UpdateTask) => {
    editTask({ updatedTask, id });
  };

  return {
    isOpen,
    openModal,
    closeModal,
    handleSubmit,
    isPending,
  };
};
