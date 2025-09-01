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
});
