// src/components/Footer.test.tsx

import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import "@testing-library/jest-dom";

describe("Footer Component", () => {
  it("renderiza o texto correto com o ano atual", () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);

    const footer = screen.getByText(
      `MedicalAppointmentSystem © ${currentYear}`
    );
    expect(footer).toBeInTheDocument();
  });
});
