import { useState } from "react";
import { useCreateTask } from "./useCreateTask";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createTask, isPending } = useCreateTask({
    onSuccess: () => {
      setIsOpen(false);
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
