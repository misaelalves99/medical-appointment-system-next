// src/hooks/useSpecialty.test.tsx
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { SpecialtyProvider } from "../contexts/SpecialtyProvider"; // provider real
import { useSpecialty } from "./useSpecialty";

describe("useSpecialty hook com provider real", () => {
  const wrapper = ({ children }: React.PropsWithChildren) => (
    <SpecialtyProvider>{children}</SpecialtyProvider>
  );

  it("retorna o contexto e métodos corretamente", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });

    expect(result.current.specialties).toBeDefined();
    expect(Array.isArray(result.current.specialties)).toBe(true);
    expect(typeof result.current.addSpecialty).toBe("function");
    expect(typeof result.current.updateSpecialty).toBe("function");
    expect(typeof result.current.removeSpecialty).toBe("function");
  });

  it("deve adicionar uma especialidade corretamente", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });

    act(() => result.current.addSpecialty("Cardiologia"));
    expect(result.current.specialties).toContain("Cardiologia");
  });

  it("deve atualizar uma especialidade corretamente", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });

    act(() => result.current.addSpecialty("Cardiologia"));
    act(() => result.current.updateSpecialty(0, "Neurologia"));

    expect(result.current.specialties[0]).toBe("Neurologia");
  });

  it("deve remover uma especialidade corretamente", () => {
    const { result } = renderHook(() => useSpecialty(), { wrapper });

    act(() => result.current.addSpecialty("Cardiologia"));
    act(() => result.current.removeSpecialty(0));

    expect(result.current.specialties.length).toBe(0);
  });

  it("lança erro se usado fora do SpecialtyProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useSpecialty())).toThrow(
      "useSpecialty deve ser usado dentro de um SpecialtyProvider"
    );
    consoleError.mockRestore();
  });
});
