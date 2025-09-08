// src/hooks/useDoctor.test.tsx

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { DoctorsProvider } from "../contexts/DoctorProvider";
import { useDoctor } from "./useDoctor";

describe("useDoctor hook com provider real", () => {
  const wrapper = ({ children }: React.PropsWithChildren) => (
    <DoctorsProvider>{children}</DoctorsProvider>
  );

  it("retorna o contexto real e métodos definidos", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });

    expect(result.current.doctors).toBeDefined();
    expect(Array.isArray(result.current.doctors)).toBe(true);

    expect(typeof result.current.addDoctor).toBe("function");
    expect(typeof result.current.updateDoctor).toBe("function");
    expect(typeof result.current.removeDoctor).toBe("function");
  });

  it("deve adicionar um médico corretamente", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });

    const newDoctor = {
      id: 1,
      name: "Dr. Teste",
      fullName: "Dr. Teste Completo",
      crm: "123456",
      specialty: "Cardio",
      email: "teste@doc.com",
      phone: "11999999999",
      isActive: true,
    };

    act(() => result.current.addDoctor(newDoctor));
    expect(result.current.doctors).toContainEqual(newDoctor);
  });

  it("deve atualizar um médico corretamente", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });

    const doctor = {
      id: 1,
      name: "Dr. Teste",
      fullName: "Dr. Teste Completo",
      crm: "123456",
      specialty: "Cardio",
      email: "teste@doc.com",
      phone: "11999999999",
      isActive: true,
    };
    act(() => result.current.addDoctor(doctor));

    const updatedDoctor = { ...doctor, name: "Dr. Atualizado" };
    act(() => result.current.updateDoctor(updatedDoctor));

    expect(result.current.doctors).toContainEqual(updatedDoctor);
  });

  it("deve remover um médico corretamente", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });

    const doctor = {
      id: 1,
      name: "Dr. Teste",
      fullName: "Dr. Teste Completo",
      crm: "123456",
      specialty: "Cardio",
      email: "teste@doc.com",
      phone: "11999999999",
      isActive: true,
    };
    act(() => result.current.addDoctor(doctor));
    expect(result.current.doctors.length).toBe(1);

    act(() => result.current.removeDoctor(1));
    expect(result.current.doctors.length).toBe(0);
  });

  it("lança erro se usado fora do provider", () => {
    expect(() => renderHook(() => useDoctor())).toThrow(
      "useDoctor deve ser usado dentro de DoctorsProvider"
    );
  });
});
