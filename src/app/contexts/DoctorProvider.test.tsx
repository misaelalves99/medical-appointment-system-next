// src/contexts/DoctorProvider.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { DoctorsProvider } from "./DoctorProvider";
import { DoctorContext } from "./DoctorContext";

const TestComponent = () => {
  const { doctors, addDoctor, updateDoctor, removeDoctor } = useContext(DoctorContext);

  return (
    <div>
      <ul>
        {doctors.map(d => (
          <li key={d.id} data-testid={`doctor-${d.id}`}>
            {d.name} - {d.specialty}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          addDoctor({
            id: 0,
            name: "Dr. Teste",
            fullName: "Dr. Teste Completo",
            crm: "99999",
            specialty: "Teste",
            email: "teste@example.com",
            phone: "11999999999",
            isActive: true,
          })
        }
      >
        Add
      </button>

      <button
        onClick={() =>
          updateDoctor({
            ...doctors[0],
            name: "Dr. Updated",
          })
        }
      >
        Update
      </button>

      <button onClick={() => removeDoctor(doctors[0]?.id ?? 0)}>Remove</button>
    </div>
  );
};

describe("DoctorsProvider", () => {
  it("renderiza médicos iniciais do mock", () => {
    render(
      <DoctorsProvider>
        <TestComponent />
      </DoctorsProvider>
    );

    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0); // deve vir do doctorsMock
  });

  it("adiciona, atualiza e remove médico corretamente", async () => {
    render(
      <DoctorsProvider>
        <TestComponent />
      </DoctorsProvider>
    );

    const addBtn = screen.getByText("Add");
    const updateBtn = screen.getByText("Update");
    const removeBtn = screen.getByText("Remove");

    // Adicionar
    await userEvent.click(addBtn);
    expect(screen.getByText("Dr. Teste - Teste")).toBeInTheDocument();

    // Atualizar
    await userEvent.click(updateBtn);
    expect(screen.getByText("Dr. Updated - Teste")).toBeInTheDocument();

    // Remover
    await userEvent.click(removeBtn);
    expect(screen.queryByText("Dr. Updated - Teste")).not.toBeInTheDocument();
  });
});
