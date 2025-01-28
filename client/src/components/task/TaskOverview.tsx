import { Task, TaskPriority } from "@/utils/types";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import OverviewProperty from "../OverviewProperty";
import { Badge } from "../ui/badge";
import { PencilIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";

interface TaskOverviewProps {
  task: Task;
}

const TaskOverview = ({ task }: TaskOverviewProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const priorityStyles = {
    Low: {
      color: "text-neutral-500",
    },
    Medium: {
      color: "text-yellow-500",
    },
    High: {
      color: "text-red-500",
    },
  };

  const { color } = priorityStyles[task.priority as TaskPriority];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">Overview</CardTitle>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => setOpen(true)}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <Separator className="my-4" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Title">{task.title}</OverviewProperty>

          <OverviewProperty label="Description">
            {task.description}
          </OverviewProperty>

          <OverviewProperty label="Due Date">
            {new Date(task.dueDate).toDateString()}
          </OverviewProperty>

          <OverviewProperty label="Priority">
            <p
              className={`text-sm flex flex-row items-center justify-between ${color}`}
            >
              {task.priority} Priority
            </p>
          </OverviewProperty>

          <OverviewProperty label="Status">
            <Badge variant={task.status}>{task.status}</Badge>
          </OverviewProperty>
        </div>
      </CardContent>

      <EditTaskModal
        open={open}
        onOpenChange={() => setOpen(false)}
        task={task}
      />
    </Card>
  );
};

export default TaskOverview;
