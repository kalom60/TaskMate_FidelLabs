import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ListChecksIcon } from "lucide-react";

interface DataFilterProps {
  setStatus: (value: string | null) => void;
  setPriority: (value: string | null) => void;
}

const DataFilters = ({ setStatus, setPriority }: DataFilterProps) => {
  const onStatusChange = (value: string) =>
    value === "all" ? setStatus(null) : setStatus(value);

  const onPriorityChange = (value: string) =>
    value === "all" ? setPriority(null) : setPriority(value);

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select onValueChange={(value) => onStatusChange(value)}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value="Not Started">Not Started</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onPriorityChange(value)}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Priorities" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectSeparator />
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DataFilters;
