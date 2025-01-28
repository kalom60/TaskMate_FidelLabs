import axiosInstance from "@/utils/axiosInstance";
import { UpdateTask } from "@/utils/types";

export const createTask = async (formData: FormData) => {
  const response = await axiosInstance.post("/task", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getTasks = async () => {
  const response = await axiosInstance.get("/task");
  return response.data;
};

export const getTask = async (id: string) => {
  const response = await axiosInstance.get(`/task/${id}`);
  return response.data;
};

export const createSubtask = async (subtask: { title: string }, id: string) => {
  const response = await axiosInstance.post(`/task/${id}/subtask`, subtask);
  return response.data;
};

export const editTask = async (updatedTask: UpdateTask, id: string) => {
  const response = await axiosInstance.patch(`/task/${id}`, updatedTask);

  return response.data;
};

export const editSubtask = async (
  id: string,
  subtaskId: string,
  subtask: { title: string }
) => {
  const response = await axiosInstance.patch(
    `/task/${id}/subtask/${subtaskId}`,
    subtask
  );
  return response.data;
};

export const deleteTask = async (id: string) => {
  const resposne = await axiosInstance.delete(`/task/${id}`);
  return resposne.data;
};

export const deleteSubtask = async (id: string, subtaskId: string) => {
  const response = await axiosInstance.delete(
    `/task/${id}/subtask/${subtaskId}`
  );
  return response.data;
};
