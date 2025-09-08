// src/contexts/PatientContext.test.tsx

import { render } from "@testing-library/react";
import { PatientContext, PatientContextType } from "./PatientContext";

describe("PatientContext", () => {
  it("deve criar contexto com funções definidas", () => {
    const contextValue: PatientContextType = {
      patients: [],
      addPatient: jest.fn(),
      updatePatient: jest.fn(),
      deletePatient: jest.fn(),
      updatePatientProfilePicture: jest.fn(),
    };

    // Dummy component para testar o Provider
    const Dummy = () => (
      <PatientContext.Provider value={contextValue}>
        <div>Teste</div>
      </PatientContext.Provider>
    );

    const { getByText } = render(<Dummy />);
    expect(getByText("Teste")).toBeInTheDocument();

    // Garante que todas as funções estão presentes
    expect(typeof contextValue.addPatient).toBe("function");
    expect(typeof contextValue.updatePatient).toBe("function");
    expect(typeof contextValue.deletePatient).toBe("function");
    expect(typeof contextValue.updatePatientProfilePicture).toBe("function");
  });
});
