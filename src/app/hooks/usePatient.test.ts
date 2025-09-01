// src/hooks/usePatient.test.tsx

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { PatientContext, PatientContextType } from "../contexts/PatientContext";
import { usePatient } from "./usePatient";
import type { Patient } from "../types/Patient";

describe("usePatient hook", () => {
  const mockContext: PatientContextType = {
    patients: [],
    addPatient: jest.fn(),
    updatePatient: jest.fn(),
    deletePatient: jest.fn(),
    updatePatientProfilePicture: jest.fn(),
  };

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <PatientContext.Provider value={mockContext}>{children}</PatientContext.Provider>
  );

  it("deve retornar o contexto de pacientes quando usado dentro do provider", () => {
    const { result } = renderHook(() => usePatient(), { wrapper });
    expect(result.current).toBe(mockContext);

    act(() => {
      const newPatient: Patient = {
        id: 1,
        name: "Paciente Teste",
        cpf: "123.456.789-00",
        dateOfBirth: "2000-01-01",
        email: "teste@paciente.com",
        phone: "11999999999",
        address: "Rua Teste, 123",
      };
      result.current.addPatient(newPatient);
    });

    expect(mockContext.addPatient).toHaveBeenCalled();
  });

  it("deve lançar erro se usado fora do PatientProvider", () => {
    expect(() => usePatient()).toThrow(
      new Error("usePatient deve ser usado dentro de um PatientProvider")
    );
  });
});
