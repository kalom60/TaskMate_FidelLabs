import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  dueDate: z.date({ invalid_type_error: "Invalid date format" }),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  files: z.array(z.instanceof(File)).optional(),
});

export const createSubtaskSchema = z.object({
  title: z.string().nonempty("Title is required"),
});
