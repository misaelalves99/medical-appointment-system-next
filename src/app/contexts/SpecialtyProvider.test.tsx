// src/contexts/SpecialtyProvider.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { SpecialtyProvider } from "./SpecialtyProvider";
import { SpecialtyContext } from "./SpecialtyContext";

describe("SpecialtyProvider", () => {
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
      <SpecialtyProvider>
        <TestComponent />
      </SpecialtyProvider>
    );

    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
  });

  it("deve atualizar uma especialidade", async () => {
    render(
      <SpecialtyProvider>
        <TestComponent />
      </SpecialtyProvider>
    );

    await userEvent.click(screen.getByText("Add"));
    await userEvent.click(screen.getByText("Update"));
    expect(screen.getByText("Neurologia")).toBeInTheDocument();
    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
  });

  it("deve remover uma especialidade", async () => {
    render(
      <SpecialtyProvider>
        <TestComponent />
      </SpecialtyProvider>
    );

    await userEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
  });
});
