// src/contexts/SpecialtyContext.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useContext, useState, ReactNode } from "react";
import { SpecialtyContext, SpecialtyContextType } from "./SpecialtyContext";
import type { Specialty } from "../types/Specialty";

describe("SpecialtyContext", () => {
  // Provider de teste com tipagem correta
  const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);

    const addSpecialty = (name: string) => {
      const newId = specialties.length > 0 ? Math.max(...specialties.map(s => s.id)) + 1 : 1;
      const newSpecialty: Specialty = { id: newId, name, isActive: true };
      setSpecialties([...specialties, newSpecialty]);
    };

    const updateSpecialty = (id: number, name: string) => {
      setSpecialties(specialties.map(s => (s.id === id ? { ...s, name } : s)));
    };

    const removeSpecialty = (id: number) => {
      setSpecialties(specialties.filter(s => s.id !== id));
    };

    const contextValue: SpecialtyContextType = { specialties, addSpecialty, updateSpecialty, removeSpecialty };

    return <SpecialtyContext.Provider value={contextValue}>{children}</SpecialtyContext.Provider>;
  };

  // Componente de teste
  const TestComponent = () => {
    const { specialties, addSpecialty, updateSpecialty, removeSpecialty } = useContext(SpecialtyContext)!;

    return (
      <div>
        <ul>
          {specialties.map(s => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
        <button onClick={() => addSpecialty("Cardiologia")}>Add</button>
        <button onClick={() => updateSpecialty(1, "Neurologia")}>Update</button>
        <button onClick={() => removeSpecialty(1)}>Remove</button>
      </div>
    );
  };

  it("deve adicionar uma especialidade", async () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
  });

  it("deve atualizar uma especialidade", async () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    await userEvent.click(screen.getByText("Add"));
    await userEvent.click(screen.getByText("Update"));
    expect(screen.getByText("Neurologia")).toBeInTheDocument();
    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
  });

  it("deve remover uma especialidade", async () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    await userEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
  });

  it("deve garantir que isActive é sempre true ao adicionar", async () => {
    let contextValue: SpecialtyContextType | undefined;
    const Consumer = () => {
      contextValue = useContext(SpecialtyContext);
      return null;
    };

    render(
      <TestProvider>
        <Consumer />
      </TestProvider>
    );

    contextValue!.addSpecialty("Dermatologia");
    const added = contextValue!.specialties.find(s => s.name === "Dermatologia");
    expect(added).toBeDefined();
    expect(added!.isActive).toBe(true);
  });
});
