// src/contexts/PatientProvider.tsx

"use client";

import React, { useState } from "react";
import { PatientContext } from "./PatientContext";
import type { Patient } from "../types/Patient";
import { patientsMock } from "../mocks/patients";

interface PatientProviderProps {
  children: React.ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(patientsMock);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (updated: Patient) => {
    setPatients(prev =>
      prev.map(p => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  };

  const deletePatient = (id: number) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const updatePatientProfilePicture = (id: number, path: string) => {
    setPatients(prev =>
      prev.map(p =>
        p.id === id ? { ...p, profilePicturePath: path } : p
      )
    );
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        updatePatientProfilePicture,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
