// src/contexts/PatientProvider.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { PatientProvider } from "./PatientProvider";
import { PatientContext, PatientContextType } from "./PatientContext";
import type { Patient } from "../types/Patient";

describe("PatientProvider", () => {
  const TestComponent = () => {
    const { patients, addPatient, updatePatient, deletePatient, updatePatientProfilePicture } =
      useContext(PatientContext)!; // Garantimos que não é undefined

    return (
      <div>
        <ul>
          {patients.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
        <button
          onClick={() =>
            addPatient({
              id: 999,
              name: "Novo Paciente",
              cpf: "123.456.789-00",
              dateOfBirth: "2000-01-01",
              email: "",
              phone: "",
              address: "",
            })
          }
        >
          Add
        </button>
        <button
          onClick={() =>
            updatePatient({
              id: 999,
              name: "Paciente Atualizado",
              cpf: "123.456.789-00",
              dateOfBirth: "2000-01-01",
              email: "",
              phone: "",
              address: "",
            })
          }
        >
          Update
        </button>
        <button onClick={() => deletePatient(999)}>Delete</button>
        <button onClick={() => updatePatientProfilePicture(999, "/path/to/photo.jpg")}>Update Photo</button>
      </div>
    );
  };

  it("deve adicionar um paciente", async () => {
    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    expect(screen.queryByText("Novo Paciente")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Novo Paciente")).toBeInTheDocument();
  });

  it("deve atualizar um paciente", async () => {
    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    await userEvent.click(screen.getByText("Add"));
    await userEvent.click(screen.getByText("Update"));
    expect(screen.getByText("Paciente Atualizado")).toBeInTheDocument();
    expect(screen.queryByText("Novo Paciente")).not.toBeInTheDocument();
  });

  it("deve deletar um paciente", async () => {
    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    await userEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Novo Paciente")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("Novo Paciente")).not.toBeInTheDocument();
  });

  it("deve atualizar o path da foto do paciente", async () => {
    let patientContext!: PatientContextType; // Tipagem correta e non-null assertion

    const ContextConsumer = () => {
      patientContext = useContext(PatientContext)!; // Garantimos que não é undefined
      return null;
    };

    render(
      <PatientProvider>
        <ContextConsumer />
      </PatientProvider>
    );

    // Adiciona paciente
    patientContext.addPatient({
      id: 999,
      name: "Paciente Foto",
      cpf: "987.654.321-00",
      dateOfBirth: "2000-01-01",
      email: "",
      phone: "",
      address: "",
    });

    // Atualiza foto
    patientContext.updatePatientProfilePicture(999, "/foto.jpg");

    const updated = patientContext.patients.find((p: Patient) => p.id === 999);
    expect(updated?.profilePicturePath).toBe("/foto.jpg");
  });
});
