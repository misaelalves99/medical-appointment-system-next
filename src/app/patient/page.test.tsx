import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { usePatient } from "../hooks/usePatient";
import PatientIndex from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../hooks/usePatient", () => ({
  usePatient: jest.fn(),
}));

const pushMock = jest.fn();
const mockedUseRouter = useRouter as jest.Mock;
const mockedUsePatient = usePatient as jest.Mock;

const patients = [
  {
    id: 1,
    name: "Carlos Oliveira",
    cpf: "111.111.111-11",
    dateOfBirth: "1990-01-15",
    gender: "Masculino",
    phone: "11999999999",
    email: "carlos@example.com",
    address: "Rua A",
  },
  {
    id: 2,
    name: "Mariana Souza",
    cpf: "222.222.222-22",
    dateOfBirth: "1988-05-10",
    gender: "Feminino",
    phone: "11888888888",
    email: "mariana@example.com",
    address: "Rua B",
  },
];

const patientContext = {
  patients,
  addPatient: jest.fn(),
  updatePatient: jest.fn(),
  deletePatient: jest.fn(),
  updatePatientProfilePicture: jest.fn(),
};

describe("Patient workspace", () => {
  beforeEach(() => {
    pushMock.mockClear();
    mockedUseRouter.mockReturnValue({ push: pushMock });
    mockedUsePatient.mockReturnValue(patientContext);
  });

  it("renders the patient management workspace with provider data", () => {
    render(<PatientIndex />);

    expect(screen.getByRole("heading", { name: "Gerenciamento de pacientes" })).toBeInTheDocument();
    expect(screen.getByText("Carlos Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Mariana Souza")).toBeInTheDocument();
    expect(screen.getByText("2 pacientes encontrados")).toBeInTheDocument();
  });

  it("renders a labelled search and filters patients by name", () => {
    render(<PatientIndex />);

    const search = screen.getByRole("searchbox", { name: "Pesquisar pacientes" });
    fireEvent.change(search, { target: { value: "Mariana" } });

    expect(screen.queryByText("Carlos Oliveira")).not.toBeInTheDocument();
    expect(screen.getByText("Mariana Souza")).toBeInTheDocument();
    expect(screen.getByText("1 paciente encontrado")).toBeInTheDocument();
  });

  it("filters by CPF as part of the patient search contract", () => {
    render(<PatientIndex />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Pesquisar pacientes" }), {
      target: { value: "222.222" },
    });

    expect(screen.queryByText("Carlos Oliveira")).not.toBeInTheDocument();
    expect(screen.getByText("Mariana Souza")).toBeInTheDocument();
  });

  it("shows a distinct no-results state for unmatched search", () => {
    render(<PatientIndex />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Pesquisar pacientes" }), {
      target: { value: "inexistente" },
    });

    expect(screen.getByRole("heading", { name: "Nenhum resultado encontrado" })).toBeInTheDocument();
    expect(screen.getByText("0 pacientes encontrados")).toBeInTheDocument();
  });

  it("shows the empty-domain state when no patients exist", () => {
    mockedUsePatient.mockReturnValue({
      ...patientContext,
      patients: [],
    });

    render(<PatientIndex />);

    expect(screen.getByRole("heading", { name: "Nenhum paciente cadastrado" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cadastrar paciente" })).toBeInTheDocument();
  });

  it("navigates to patient creation from the primary action", () => {
    render(<PatientIndex />);

    fireEvent.click(screen.getByRole("button", { name: "Novo paciente" }));

    expect(pushMock).toHaveBeenCalledWith("/patient/create");
  });

  it("exposes explicit accessible names for row actions and preserves routing", () => {
    render(<PatientIndex />);

    fireEvent.click(screen.getByRole("button", { name: "Detalhes do paciente 1" }));
    expect(pushMock).toHaveBeenCalledWith("/patient/details/1");

    fireEvent.click(screen.getByRole("button", { name: "Editar paciente 1" }));
    expect(pushMock).toHaveBeenCalledWith("/patient/edit/1");

    fireEvent.click(screen.getByRole("button", { name: "Excluir paciente 1" }));
    expect(pushMock).toHaveBeenCalledWith("/patient/delete/1");
  });
});
