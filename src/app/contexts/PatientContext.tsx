// src/contexts/PatientContext.tsx

"use client";

import { createContext } from "react";
import type { Patient } from "../types/Patient";

export interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: number) => void;
  updatePatientProfilePicture: (id: number, path: string) => void;
}

// Criando o contexto tipado, mas inicializado como undefined para checagem no hook
export const PatientContext = createContext<PatientContextType | undefined>(
  undefined
);
