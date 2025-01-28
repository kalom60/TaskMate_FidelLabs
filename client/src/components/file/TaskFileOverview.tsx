import { File } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import FileInput from "./FileInput";
import { useState } from "react";

interface TaskFileOverviewProps {
  files: File[];
}

const TaskFileOverview = ({ files }: TaskFileOverviewProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return (
    <div>
      <Card>
        <CardHeader>
          <FileInput onFileChange={(files) => setSelectedFiles(files)} />
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
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <a
                      href={file.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {file.fileName}
                    </a>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskFileOverview;
