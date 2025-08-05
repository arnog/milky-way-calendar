import AstronomicalDataTable from "./AstronomicalDataTable";
import { AstronomicalDataTableConfig } from "../types/astronomicalDataTable";

interface DailyVisibilityTableProps {
  currentDate?: Date;
}

export default function DailyVisibilityTable({
  currentDate,
}: DailyVisibilityTableProps) {
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
