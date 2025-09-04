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
  });

  it("chama addSpecialty corretamente", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });

    act(() => {
      result.current.addSpecialty("Cardiologia");
    });

    expect(mockContext.addSpecialty).toHaveBeenCalledWith("Cardiologia");
  });

  it("chama updateSpecialty corretamente", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });

    act(() => {
      result.current.updateSpecialty(0, "Neurologia");
    });

    expect(mockContext.updateSpecialty).toHaveBeenCalledWith(0, "Neurologia");
  });

  it("chama removeSpecialty corretamente", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });

    act(() => {
      result.current.removeSpecialty(0);
    });

    expect(mockContext.removeSpecialty).toHaveBeenCalledWith(0);
  });

  // Opcional: se você quiser seguir padrão useDoctor, poderia adicionar checagem de uso fora do provider
  it("lança erro se usado fora do provider", () => {
    // suprime erro do React no console
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => renderHook(() => useSpecialty())).toThrow();
    
    consoleError.mockRestore();
  });
});
