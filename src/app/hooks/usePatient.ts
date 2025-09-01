// src/hooks/usePatient.ts

import { useContext } from "react";
import { PatientContext, type PatientContextType } from "../contexts/PatientContext";

// Hook customizado para acessar contexto de pacientes
export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);

  if (!context) {
    throw new Error("usePatient deve ser usado dentro de um PatientProvider");
  }

  return context;
};
