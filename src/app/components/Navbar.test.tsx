// src/components/Navbar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import "@testing-library/jest-dom";

// mock do usePathname do Next.js
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// importa o hook já tipado como jest.Mock
import { usePathname } from "next/navigation";

describe("Navbar Component", () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza logotipo com link para home", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navbar />);

    const logo = screen.getByRole("link", { name: /página inicial/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renderiza todos os links principais", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pacientes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /médicos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /especialidades/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /consultas/i })).toBeInTheDocument();
  });

  it("aplica classe ativa no link correspondente ao pathname", () => {
    mockUsePathname.mockReturnValue("/doctors");
    render(<Navbar />);

    const doctorsLink = screen.getByRole("link", { name: /médicos/i });
    expect(doctorsLink.className).toMatch(/activeLink/);
  });

  it("alternar menu ao clicar no botão", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navbar />);

    const toggleButton = screen.getByRole("button", { name: /abrir menu/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(toggleButton).toHaveAccessibleName("Fechar menu");
  });
});
