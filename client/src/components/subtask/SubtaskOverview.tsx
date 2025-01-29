import { Subtask } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideWorkflow, MoreVertical, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import CreateSubtaskModal from "./CreateSubtaskModel";
import SubtaskActions from "./SubtaskActions";
import { useCreateSubtaskModal } from "@/hooks/useCreateSubtaskModal";

interface SubtaskOverviewProps {
  id: string;
  subtasks: Subtask[];
}

const SubtaskOverview = ({ id, subtasks }: SubtaskOverviewProps) => {
  const { isOpen, openModal, closeModal, handleSubmit, isPending } =
    useCreateSubtaskModal({
      id,
    });

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg">Subtasks</CardTitle>
            <Button size={"sm"} onClick={openModal}>
              <PlusCircle className="size-4 mr-2" />
              Add
            </Button>
          </div>
          <Separator className="my-4" />
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-2">
            {subtasks &&
              subtasks.map((subtask) => (
                <Card key={subtask.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <LucideWorkflow className="size-5" />
                      <span>{subtask.title}</span>
                    </div>
                    <SubtaskActions id={id} subtask={subtask}>
                      <Button variant={"ghost"} className="size-8 p-0">
                        <MoreVertical className="size-4" />
                      </Button>
                    </SubtaskActions>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      <CreateSubtaskModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreate={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
};

export default SubtaskOverview;
