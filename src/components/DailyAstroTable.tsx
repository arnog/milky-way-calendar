import AstronomicalDataTable from "./AstronomicalDataTable";
import { AstronomicalDataTableConfig } from "../types/astronomicalDataTable";

interface DailyAstroTableProps {
  currentDate?: Date;
}

export default function DailyAstroTable({
  currentDate,
}: DailyAstroTableProps) {
  const config: AstronomicalDataTableConfig = {
    mode: 'daily',
    showExpandableDetails: true,
    title: "Next 7 Days",
    initialItemCount: 7,
  };

  return (
    <AstronomicalDataTable
      currentDate={currentDate}
      config={config}
    />
  );
}
