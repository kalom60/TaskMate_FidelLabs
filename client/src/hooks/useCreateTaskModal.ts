import { useState } from "react";
import { useCreateTask } from "./useCreateTask";

interface UseCreateTaskModalProps {
  onSuccess?: () => void;
}

export const useCreateTaskModal = ({ onSuccess }: UseCreateTaskModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createTask, isPending } = useCreateTask({
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
    onCancel: () => setIsOpen(false),
  });

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const handleSubmit = (formData: FormData) => {
    createTask(formData);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    handleSubmit,
    isPending,
  };
};
