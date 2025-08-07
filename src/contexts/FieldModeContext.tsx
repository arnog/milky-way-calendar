import { createContext, useState, ReactNode } from "react";

export interface FieldModeContextType {
  isFieldMode: boolean;
  toggleFieldMode: () => void;
}

export const FieldModeContext = createContext<FieldModeContextType | undefined>(
  undefined,
);

interface FieldModeProviderProps {
  children: ReactNode;
}

export function FieldModeProvider({ children }: FieldModeProviderProps) {
  const [isFieldMode, setIsFieldMode] = useState(false);

  const toggleFieldMode = () => {
    setIsFieldMode(!isFieldMode);
  };

  return (
    <FieldModeContext.Provider value={{ isFieldMode, toggleFieldMode }}>
      {children}
    </FieldModeContext.Provider>
  );
}
