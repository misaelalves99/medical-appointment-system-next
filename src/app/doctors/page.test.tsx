// src/app/doctors/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DoctorList from "./page";
import { doctorsMock } from "../mocks/doctors";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../hooks/useDoctor", () => ({
  useDoctor: () => ({ doctors: doctorsMock }),
}));

describe("DoctorList Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza a lista de médicos com cabeçalhos da tabela", async () => {
    render(<DoctorList />);
    expect(screen.getByText("Lista de Médicos")).toBeInTheDocument();

    doctorsMock.forEach((doctor) => {
      expect(screen.getByText(doctor.name)).toBeInTheDocument();
    });

    const headers = ["ID", "Nome", "CRM", "Especialidade", "Ativo", "Ações"];
    headers.forEach((header) => expect(screen.getByText(header)).toBeInTheDocument());
  });

  it("exibe todos os médicos quando a pesquisa está vazia", async () => {
    render(<DoctorList />);
    doctorsMock.forEach(async (doctor) => {
      expect(await screen.findByText(doctor.name)).toBeInTheDocument();
    });
  });

  it("permite pesquisar médicos por qualquer campo (case-insensitive)", async () => {
    render(<DoctorList />);
    const searchInput = screen.getByPlaceholderText(
      /Pesquisar por ID, Nome, CRM, Especialidade ou Status/i
    );

    // pesquisa por nome lowercase
    fireEvent.change(searchInput, { target: { value: doctorsMock[0].name.toLowerCase() } });
    await waitFor(() => {
      expect(screen.getByText(doctorsMock[0].name)).toBeInTheDocument();
    });

    // pesquisa por valor inexistente
    fireEvent.change(searchInput, { target: { value: "Inexistente" } });
    await waitFor(() => {
      expect(screen.getByText(/Nenhum médico encontrado/i)).toBeInTheDocument();
    });
  });

  it("navega para a página de criação ao clicar em 'Cadastrar Novo Médico'", () => {
    render(<DoctorList />);
    fireEvent.click(screen.getByText(/Cadastrar Novo Médico/i));
    expect(mockPush).toHaveBeenCalledWith("/doctors/create");
  });

  it("navega para detalhes, edição e exclusão do médico", async () => {
    render(<DoctorList />);
    const doctor = doctorsMock[0];

    const detailsButton = await screen.findByRole("button", { name: /Detalhes/i });
    fireEvent.click(detailsButton);
    expect(mockPush).toHaveBeenCalledWith(`/doctors/details/${doctor.id}`);

    const editButton = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(editButton);
    expect(mockPush).toHaveBeenCalledWith(`/doctors/edit/${doctor.id}`);

    const deleteButton = screen.getByRole("button", { name: /Excluir/i });
    fireEvent.click(deleteButton);
    expect(mockPush).toHaveBeenCalledWith(`/doctors/delete/${doctor.id}`);
  });
});
