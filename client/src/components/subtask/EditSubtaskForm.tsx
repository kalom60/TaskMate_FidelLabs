import { Subtask } from "@/utils/types";
import { createSubtaskSchema } from "@/features/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEditSubtask } from "@/hooks/useEditSubtask";

interface EditSubtaskFormProps {
  id: string;
  subtask: Subtask;
  onCancel: (open: boolean) => void;
}

const EditSubtaskForm = ({ id, subtask, onCancel }: EditSubtaskFormProps) => {
  const { mutate } = useEditSubtask(() => onCancel(false), id);
  const { id: subtaskId } = subtask;

  const form = useForm<z.infer<typeof createSubtaskSchema>>({
    resolver: zodResolver(createSubtaskSchema),
    defaultValues: {
      title: subtask.title,
    },
  });

  const onSubmit = async (values: z.infer<typeof createSubtaskSchema>) => {
    const subtask: { title: string } = {
      title: values.title,
    };

    mutate({ id, subtaskId, subtask });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit subtask</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter subtask title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="py-7">
              <Separator />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size={"lg"}
                variant={"secondary"}
                onClick={() => onCancel(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"}>
                Edit Subtask
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditSubtaskForm;
