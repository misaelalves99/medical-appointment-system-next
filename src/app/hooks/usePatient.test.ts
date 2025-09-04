// src/hooks/useDoctor.test.tsx

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { DoctorContext, DoctorContextType } from "../contexts/DoctorContext";
import { useDoctor } from "./useDoctor";

describe("useDoctor hook", () => {
  const mockContext: DoctorContextType = {
    doctors: [],
    addDoctor: jest.fn(),
    updateDoctor: jest.fn(),
    removeDoctor: jest.fn(),
  };

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <DoctorContext.Provider value={mockContext}>{children}</DoctorContext.Provider>
  );

  it("deve retornar o contexto de doctors", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });
    expect(result.current).toBe(mockContext);
  });

  it("chama addDoctor corretamente", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });

    act(() => {
      result.current.addDoctor({
        id: 1,
        name: "Dr. Teste",
        fullName: "Dr. Teste Completo",
        crm: "123456",
        specialty: "Cardio",
        email: "teste@doc.com",
        phone: "11999999999",
        isActive: true,
      });
    });

    expect(mockContext.addDoctor).toHaveBeenCalledWith({
      id: 1,
      name: "Dr. Teste",
      fullName: "Dr. Teste Completo",
      crm: "123456",
      specialty: "Cardio",
      email: "teste@doc.com",
      phone: "11999999999",
      isActive: true,
    });
  });

  it("chama updateDoctor corretamente", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });

    act(() => {
      result.current.updateDoctor({
        id: 1,
        name: "Dr. Atualizado",
        fullName: "Dr. Atualizado Completo",
        crm: "654321",
        specialty: "Neurologia",
        email: "atualizado@doc.com",
        phone: "11988888888",
        isActive: false,
      });
    });

    expect(mockContext.updateDoctor).toHaveBeenCalledWith({
      id: 1,
      name: "Dr. Atualizado",
      fullName: "Dr. Atualizado Completo",
      crm: "654321",
      specialty: "Neurologia",
      email: "atualizado@doc.com",
      phone: "11988888888",
      isActive: false,
    });
  });

  it("chama removeDoctor corretamente", () => {
    const { result } = renderHook(() => useDoctor(), { wrapper });

    act(() => {
      result.current.removeDoctor(1);
    });

    expect(mockContext.removeDoctor).toHaveBeenCalledWith(1);
  });

  it("lança erro se usado fora do provider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {}); // suprime erro React
    expect(() => renderHook(() => useDoctor())).toThrow(
      "useDoctor deve ser usado dentro de DoctorsProvider"
    );
    consoleError.mockRestore();
  });
});
