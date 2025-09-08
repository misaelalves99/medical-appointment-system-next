// src/contexts/DoctorContext.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { DoctorContext } from "./DoctorContext";
import { DoctorsProvider } from "./DoctorProvider";

const TestComponent = () => {
  const context = useContext(DoctorContext);
  if (!context) throw new Error("DoctorContext must be used within a DoctorsProvider");

  const { doctors, addDoctor, updateDoctor, removeDoctor } = context;

  return (
    <div>
      <span data-testid="doctors-count">{doctors.length}</span>
      <span data-testid="first-doctor">{doctors[0]?.name ?? ""}</span>

      <button
        onClick={() =>
          addDoctor({
            id: 1,
            name: "Dr. Alice",
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

describe("DoctorsProvider - Context", () => {
  it("gerencia estado de médicos corretamente", async () => {
    const user = userEvent.setup();

    render(
      <DoctorsProvider>
        <TestComponent />
      </DoctorsProvider>
    );

    const count = screen.getByTestId("doctors-count");
    const first = screen.getByTestId("first-doctor");

    expect(count.textContent).toBe("0");
    expect(first.textContent).toBe("");

    await user.click(screen.getByText("Add"));
    expect(count.textContent).toBe("1");
    expect(first.textContent).toBe("Dr. Alice");

    await user.click(screen.getByText("Update"));
    expect(first.textContent).toBe("Dr. Bob");

    await user.click(screen.getByText("Remove"));
    expect(count.textContent).toBe("0");
    expect(first.textContent).toBe("");
  });
});
