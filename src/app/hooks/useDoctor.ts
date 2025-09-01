// src/hooks/useDoctor.tsx

import { useContext } from "react";
import { DoctorContext, type DoctorContextType } from "../contexts/DoctorContext";

// Hook com tipagem correta
export const useDoctor = (): DoctorContextType => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor deve ser usado dentro de DoctorsProvider");
  }
  return context;
};
