// src/app/doctors/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DoctorList from "./page";
import { doctorsMock } from "../mocks/doctors";

// mocks controláveis
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("DoctorList Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza a lista de médicos com cabeçalhos da tabela", async () => {
    render(<DoctorList />);

    expect(screen.getByText("Lista de Médicos")).toBeInTheDocument();
    expect(await screen.findByText(doctorsMock[0].name)).toBeInTheDocument();

    const headers = [
      "Nome",
      "CRM",
      "Especialidade",
      "Email",
      "Telefone",
      "Ativo",
      "Ações",
    ];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("permite pesquisar médicos", async () => {
    render(<DoctorList />);

    const searchInput = screen.getByPlaceholderText(/Pesquisar médicos/i);

    // garante que todos estão visíveis no início
    expect(await screen.findByText(doctorsMock[0].name)).toBeInTheDocument();

    // digita um valor que só deve encontrar um médico
    fireEvent.change(searchInput, { target: { value: doctorsMock[0].name } });

    await waitFor(() => {
      expect(screen.getByText(doctorsMock[0].name)).toBeInTheDocument();
    });

    // valor inexistente
    fireEvent.change(searchInput, { target: { value: "Inexistente" } });

    await waitFor(() => {
      doctorsMock.forEach((doctor) => {
        expect(screen.queryByText(doctor.name)).not.toBeInTheDocument();
      });
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

    // detalhes
    const detailsButton = await screen.findByRole("button", { name: /Detalhes/i });
    fireEvent.click(detailsButton);
    expect(mockPush).toHaveBeenCalledWith(`/doctors/details/${doctor.id}`);

    // edição
    const editButton = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(editButton);
    expect(mockPush).toHaveBeenCalledWith(`/doctors/edit/${doctor.id}`);

    // exclusão
    const deleteButton = screen.getByRole("button", { name: /Excluir/i });
    fireEvent.click(deleteButton);
    expect(mockPush).toHaveBeenCalledWith(`/doctors/delete/${doctor.id}`);
  });
});
