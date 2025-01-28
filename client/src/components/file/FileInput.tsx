import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { CloudUpload } from "lucide-react";
import JPG from "/jpg.svg";
import PNG from "/png.svg";
import PDF from "/pdf.svg";

interface FileInputProps {
  onFileChange: (files: File[]) => void; // Expect an array of files
}

const FileInput = ({ onFileChange }: FileInputProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const maxFileSizeMB = 10;
  const acceptedFileExtensions = ["jpg", "png", "pdf"];
  const fileTypeRegex = new RegExp(
    `\\.(${acceptedFileExtensions.join("|")})$`,
    "i"
  );
  const acceptedFileTypes = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const ImageConfig: Record<string, string> = {
    pdf: PDF,
    png: PNG,
    jpg: JPG,
    jpeg: JPG,
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (filesArray: File[]) => {
    setError(null);

    const newFiles: File[] = [];
    const existingFileNames = new Set(
      selectedFiles.map((file) => file.name.toLowerCase())
    );

    filesArray.forEach((file) => {
      if (file.size / (1024 * 1024) > maxFileSizeMB) {
        setError(
          `File "${file.name}" exceeds the size limit of ${maxFileSizeMB}MB.`
        );
        return;
      }

      if (!fileTypeRegex.test(file.name)) {
        setError(`File "${file.name}" has an invalid file type.`);
        return;
      }

      if (existingFileNames.has(file.name.toLowerCase())) {
        setError(`File "${file.name}" is already added.`);
        return;
      }

      newFiles.push(file);
    });

    // Update selected files and call the parent callback
    setSelectedFiles((prev) => {
      const updatedFiles = [...prev, ...newFiles];
      onFileChange(updatedFiles); // Notify the parent with the selected files
      return updatedFiles;
    });
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(updatedFiles);
    onFileChange(updatedFiles); // Update parent with new selected files
  };

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "default";
    return ImageConfig[ext] || ImageConfig.default;
  };

  return (
    <div>
      <div
        className="flex flex-col justify-center items-center border-2 border-dashed border-neutral-200 rounded-sm h-44 w-full cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e)}
      >
        <Input
          type="file"
          className="input-field hidden"
          accept={acceptedFileTypes}
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
        />
        <CloudUpload color="#1475cf" size={60} />
        <div className="pt-2">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG, PDF (MAX. {maxFileSizeMB}MB)
          </p>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4">
        {selectedFiles.map((file) => (
          <div
            key={file.name}
            className="flex justify-between items-center border mb-2 p-4 rounded-sm bg-[#f5f8ff]"
          >
            <img src={getFileIcon(file.name)} alt="" className="w-12 mr-5" />
            <div className="flex flex-col justify-between font-medium">
              <p>{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <span
              className="bg-[#fff] w-10 h-10 rounded-xl flex items-center justify-center font-medium text-red-600"
              onClick={() => removeFile(file.name)}
            >
              x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileInput;
