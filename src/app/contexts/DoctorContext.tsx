// src/contexts/DoctorContext.tsx

"use client";

import { createContext } from "react";
import type { Doctor } from "../types/Doctor";

export interface DoctorContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (doctor: Doctor) => void;
  removeDoctor: (id: number) => void;
}

// Criamos o contexto tipado corretamente
export const DoctorContext = createContext<DoctorContextType | undefined>(undefined);
