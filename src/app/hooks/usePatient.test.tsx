// src/hooks/usePatient.test.tsx
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { PatientProvider } from "../contexts/PatientProvider";
import { usePatient } from "./usePatient";

describe("usePatient hook com provider real", () => {
  const wrapper = ({ children }: React.PropsWithChildren) => (
    <PatientProvider>{children}</PatientProvider>
  );

  it("retorna o contexto real e métodos definidos", () => {
    const { result } = renderHook(() => usePatient(), { wrapper });

    expect(result.current.patients).toBeDefined();
    expect(Array.isArray(result.current.patients)).toBe(true);
    expect(typeof result.current.addPatient).toBe("function");
    expect(typeof result.current.updatePatient).toBe("function");
    expect(typeof result.current.deletePatient).toBe("function");
    expect(typeof result.current.updatePatientProfilePicture).toBe("function");
  });

  it("deve adicionar um paciente corretamente", () => {
    const { result } = renderHook(() => usePatient(), { wrapper });

    const newPatient = {
      id: 1,
      name: "Paciente Teste",
      email: "teste@paciente.com",
      cpf: "123.456.789-00",
      dateOfBirth: "1990-01-01",
      phone: "11999999999",
      address: "Rua Exemplo, 123",
      profilePicture: "",
    };

    act(() => result.current.addPatient(newPatient));
    expect(result.current.patients).toContainEqual(newPatient);
  });
});
