import AstronomicalDataTable from "./AstronomicalDataTable";
import { AstronomicalDataTableConfig, AstronomicalDataItem } from "../types/astronomicalDataTable";

interface CalendarProps {
  currentDate?: Date;
  onDateClick?: (date: Date) => void;
}

export default function Calendar({ currentDate, onDateClick }: CalendarProps) {
  const handleRowClick = (item: AstronomicalDataItem) => {
    if (onDateClick && item.startDate) {
      onDateClick(item.startDate);
    }
  };

  const config: AstronomicalDataTableConfig = {
    mode: 'weekly',
    enableInfiniteScroll: true,
    filterZeroVisibility: true,
    title: "Milky Way Visibility Weekly Calendar",
    initialItemCount: 12,
    itemsPerBatch: 12,
    maxItems: 260,
    onRowClick: handleRowClick,
  };

  return (
    <AstronomicalDataTable
      currentDate={currentDate}
      config={config}
    />
  );
}
