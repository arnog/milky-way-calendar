import { useContext } from "react";
import { FieldModeContext } from "../contexts/FieldModeContext";

export function useFieldMode() {
  const context = useContext(FieldModeContext);
  if (context === undefined) {
    throw new Error("useFieldMode must be used within a FieldModeProvider");
  }
  return context;
}
