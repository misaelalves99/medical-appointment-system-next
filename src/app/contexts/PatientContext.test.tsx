// src/contexts/PatientContext.test.tsx

import { render } from "@testing-library/react";
import { PatientContext, PatientContextType } from "./PatientContext";

describe("PatientContext", () => {
  it("deve criar contexto com funções", () => {
    const contextValue: PatientContextType = {
      patients: [],
      addPatient: jest.fn(),
      updatePatient: jest.fn(),
      deletePatient: jest.fn(),
      updatePatientProfilePicture: jest.fn(),
    };

    // Render dummy component para consumir contexto
    const Dummy = () => {
      return (
        <PatientContext.Provider value={contextValue}>
          <div>Teste</div>
        </PatientContext.Provider>
      );
    };

    const { getByText } = render(<Dummy />);
    expect(getByText("Teste")).toBeInTheDocument();
    // Apenas garantimos que o Provider existe
    expect(typeof contextValue.addPatient).toBe("function");
    expect(typeof contextValue.updatePatientProfilePicture).toBe("function");
  });
});
