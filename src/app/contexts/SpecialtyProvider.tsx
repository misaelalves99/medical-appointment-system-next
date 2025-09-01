// src/contexts/SpecialtyProvider.tsx

"use client";

import React, { useState } from "react";
import { SpecialtyContext } from "./SpecialtyContext";
import type { Specialty } from "../types/Specialty";
import { specialtiesMock } from "../mocks/specialties";

interface SpecialtyProviderProps {
  children: React.ReactNode;
}

export const SpecialtyProvider: React.FC<SpecialtyProviderProps> = ({ children }) => {
  const [specialties, setSpecialties] = useState<Specialty[]>(specialtiesMock);

  const addSpecialty = (name: string) => {
    const newId = specialties.length > 0 ? Math.max(...specialties.map(s => s.id)) + 1 : 1;
    const newSpecialty: Specialty = { id: newId, name, isActive: true }; // Adiciona isActive
    setSpecialties(prev => [...prev, newSpecialty]);
    console.log("Nova especialidade adicionada:", newSpecialty);
  };

  const updateSpecialty = (id: number, name: string) => {
    setSpecialties(prev =>
      prev.map(s => (s.id === id ? { ...s, name } : s))
    );
    console.log("Especialidade atualizada:", { id, name });
  };

  const removeSpecialty = (id: number) => {
    setSpecialties(prev => prev.filter(s => s.id !== id));
    console.log("Especialidade removida com id:", id);
  };

  return (
    <SpecialtyContext.Provider value={{ specialties, addSpecialty, updateSpecialty, removeSpecialty }}>
      {children}
    </SpecialtyContext.Provider>
  );
};
