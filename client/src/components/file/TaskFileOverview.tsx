import { File as TaskFile } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import FileInput from "./FileInput";
import { useState } from "react";
import JPG from "/jpg.svg";
import PNG from "/png.svg";
import PDF from "/pdf.svg";
import { useAddTaskFile } from "@/hooks/useAddTaskFile";
import { useDeleteTaskFile } from "@/hooks/useDeleteTaskFile";
import DeleteConfirmation from "../kanban/DeleteConfirmation";

interface TaskFileOverviewProps {
  id: string;
  files: TaskFile[];
}

const TaskFileOverview = ({ id, files }: TaskFileOverviewProps) => {
  const [selectedFileID, setSelectedFileID] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const { mutate } = useAddTaskFile(id);
  const { mutate: deleteFileMutate } = useDeleteTaskFile(id);

  const ImageConfig: Record<string, string> = {
    pdf: PDF,
    png: PNG,
    jpg: JPG,
    jpeg: JPG,
  };

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "default";
    return ImageConfig[ext] || ImageConfig.default;
  };

  const updateTaskFile = (files: File[]) => {
    setIsUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    mutate(
      { formData, id },
      {
        onSettled: () => {
          setIsUploading(false);
        },
      }
    );
  };

  const onDeleteTaskFile = () => {
    setIsUploading(true);
    const taskId = id;
    const fileId = selectedFileID;

    deleteFileMutate(
      { taskId, fileId },
      {
        onSettled: () => {
          setIsUploading(false);
          setSelectedFileID("");
        },
      }
    );
  };

  return (
    <div>
      {isUploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />{" "}
        </div>
      )}

      <Card>
        <CardHeader>
          <FileInput
            files={files}
            isEdit={true}
            onFileChange={(files) => updateTaskFile(files)}
          />
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <CardTitle>Attached Files</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {files &&
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 border rounded-lg bg-[#f5f8ff]"
                >
                  <div className="flex items-center space-x-2">
                    {/* <FileText className="w-4 h-4 text-gray-500" /> */}
                    <img
                      src={getFileIcon(file.fileName)}
                      alt=""
                      className="size-10 mr-5"
                    />
                    <a
                      href={file.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {file.fileName}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                    <span
                      className="bg-[#fff] w-10 h-10 rounded-xl flex items-center justify-center font-medium text-red-600 hover:cursor-pointer"
                      onClick={() => {
                        setSelectedFileID(file.id);
                        setAlertOpen(true);
                      }}
                    >
                      <X />
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmation
        open={alertOpen}
        title={"Delete file"}
        message={
          "This action cannot be undone. This will permanently delete this file from the task."
        }
        onOpenChange={() => setAlertOpen(false)}
        onConfirm={onDeleteTaskFile}
      />
    </div>
  );
};

export default TaskFileOverview;
