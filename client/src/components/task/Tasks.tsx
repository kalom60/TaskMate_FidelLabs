import { Loader, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { useState, useMemo, useCallback } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { useGetTasks } from "@/hooks/useGetTasks";
import DataFilters from "../table/DataFilters";
import { DataTable } from "../table/DataTable";
import { columns } from "../table/Column";
import { Task, TaskStatus } from "@/utils/types";
import DataKanban from "../kanban/DataKanban";
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal";

const Tasks = () => {
  const [view, setView] = useState<string>("table");
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);

  const { isOpen, openModal, closeModal, handleSubmit, isPending } =
    useCreateTaskModal();

  const { data: tasks, isLoading } = useGetTasks();

  const filteredTasks = useMemo(() => {
    return (
      tasks?.filter((task: Task) => {
        const matchesStatus = status ? task.status === status : true;
        const matchesPriority = priority ? task.priority === priority : true;
        return matchesStatus && matchesPriority;
      }) ?? []
    );
  }, [tasks, status, priority]);

  const onKanbanChange = useCallback(
    (tasks: { id: string; status: TaskStatus }[]) => {
      console.log(tasks);
    },
    []
  );

  return (
    <>
      <Tabs
        defaultValue={view}
        onValueChange={(value) => setView(value)}
        className="flex-1 w-full border rounded-lg"
      >
        <div className="h-full flex flex-col overflow-auto p-4">
          <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                Table
              </TabsTrigger>
              <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
                Kanban
              </TabsTrigger>
            </TabsList>
            <Button
              size={"sm"}
              className="w-full lg:w-auto"
              onClick={openModal}
            >
              <PlusIcon className="size-4 mr-2" />
              New
            </Button>
          </div>
          <Separator className="my-4" />
          <DataFilters setStatus={setStatus} setPriority={setPriority} />
          <Separator className="my-4" />
          {isLoading ? (
            <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
              <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="table" className="mt-0">
                <DataTable columns={columns} data={filteredTasks ?? []} />
              </TabsContent>
              <TabsContent value="kanban" className="mt-0">
                <DataKanban
                  data={filteredTasks ?? []}
                  onChange={onKanbanChange}
                />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>

      <CreateTaskModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreate={handleSubmit}
        isPending={isPending}
      />
    </>
  );
};

export default Tasks;
