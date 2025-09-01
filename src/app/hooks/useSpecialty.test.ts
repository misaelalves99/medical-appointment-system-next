// src/hooks/useSpecialty.test.tsx

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { SpecialtyContext, SpecialtyContextType } from "../contexts/SpecialtyContext";
import { useSpecialty } from "./useSpecialty";

describe("useSpecialty hook", () => {
  const mockContext: SpecialtyContextType = {
    specialties: [],
    addSpecialty: jest.fn(),
    updateSpecialty: jest.fn(),
    removeSpecialty: jest.fn(),
  };

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SpecialtyContext.Provider value={mockContext}>{children}</SpecialtyContext.Provider>
  );

  it("deve retornar o contexto de especialidades", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });
    expect(result.current).toBe(mockContext);

    act(() => {
      result.current.addSpecialty("Cardiologia");
    });

    expect(mockContext.addSpecialty).toHaveBeenCalledWith("Cardiologia");
  });
});
