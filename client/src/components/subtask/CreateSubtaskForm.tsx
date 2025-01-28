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

interface CreateSubtaskFormProps {
  onCreate: (subtask: { title: string }) => void;
  onClose: () => void;
  isPending: boolean;
}

const CreateSubtaskForm = ({
  onCreate,
  onClose,
  isPending,
}: CreateSubtaskFormProps) => {
  const form = useForm<z.infer<typeof createSubtaskSchema>>({
    resolver: zodResolver(createSubtaskSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createSubtaskSchema>) => {
    onCreate({ title: values.title });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new subtask
        </CardTitle>
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
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"}>
                {isPending ? "Creating..." : "Create Subtask"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateSubtaskForm;
