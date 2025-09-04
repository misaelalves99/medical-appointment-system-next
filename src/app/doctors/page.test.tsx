// src/app/doctors/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DoctorList from "./page";
import { doctorsMock } from "../mocks/doctors";

// Mock do router do Next.js
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock do hook useDoctor
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

    // checa se pelo menos um médico está visível
    expect(await screen.findByText(doctorsMock[0].name)).toBeInTheDocument();

    const headers = ["ID", "Nome", "CRM", "Especialidade", "Ativo", "Ações"];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("permite pesquisar médicos por qualquer campo", async () => {
    render(<DoctorList />);

    const searchInput = screen.getByPlaceholderText(
      /Pesquisar por ID, Nome, CRM, Especialidade ou Status/i
    );

    // garante que todos estão visíveis no início
    expect(await screen.findByText(doctorsMock[0].name)).toBeInTheDocument();

    // pesquisa por nome
    fireEvent.change(searchInput, { target: { value: doctorsMock[0].name } });
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

    const createButton = screen.getByText(/Cadastrar Novo Médico/i);
    fireEvent.click(createButton);

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
