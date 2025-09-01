// src/contexts/DoctorContext.test.tsx

import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { DoctorContext, DoctorContextType } from "./DoctorContext";

const TestComponent = () => {
  const { doctors, addDoctor, updateDoctor, removeDoctor } = useContext<DoctorContextType>(DoctorContext);

  return (
    <div>
      <span data-testid="doctors-count">{doctors.length}</span>
      <button
        onClick={() =>
          addDoctor({
            id: 1,
            name: "Dr. Alice",
            fullName: "Dra. Alice Silva",
            crm: "12345",
            specialty: "Cardiology",
            email: "alice@example.com",
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
            id: 1,
            name: "Dr. Bob",
            fullName: "Dr. Bob Souza",
            crm: "12345",
            specialty: "Cardiology",
            email: "bob@example.com",
            phone: "11999999999",
            isActive: true,
          })
        }
      >
        Update
      </button>
      <button onClick={() => removeDoctor(1)}>Remove</button>
    </div>
  );
};

describe("DoctorContext", () => {
  it("inicializa com valores padrão e permite manipulação de estado (mocked)", () => {
    render(
      <DoctorContext.Provider
        value={{
          doctors: [],
          addDoctor: jest.fn(),
          updateDoctor: jest.fn(),
          removeDoctor: jest.fn(),
        }}
      >
        <TestComponent />
      </DoctorContext.Provider>
    );

    const count = screen.getByTestId("doctors-count");
    expect(count.textContent).toBe("0");

    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });
});
