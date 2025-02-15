import { useState } from "react";
import { useCreateSubtask } from "@/hooks/useCreateSubtask";

interface UseCreateSubtaskModalProps {
  id: string;
}

export const useCreateSubtaskModal = ({ id }: UseCreateSubtaskModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createSubtask, isPending } = useCreateSubtask({
    onSuccess: () => {
      setIsOpen(false);
    },
    onCancel: () => setIsOpen(false),
    id,
  });

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const handleSubmit = (values: { title: string }) => {
    createSubtask({ subtask: values, id: id });
  };

  return {
    isOpen,
    openModal,
    closeModal,
    handleSubmit,
    isPending,
  };
};
