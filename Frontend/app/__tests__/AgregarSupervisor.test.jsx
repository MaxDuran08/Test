import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AgregarSupervisor from "../components/AgregarSupervisor";
import "@testing-library/jest-dom";

// Mock de los servicios
jest.mock("../components/services/supervisorServices", () => ({
  agregarSupervisor: jest.fn().mockResolvedValue({}),
}));

jest.mock("../components/services/gerenteServices", () => ({
  obtenerSupervisores: jest.fn().mockResolvedValue([]),
}));

describe("AgregarSupervisor", () => {
  it("renderiza correctamente el formulario", () => {
    render(<AgregarSupervisor />);

    expect(screen.getByLabelText(/CUI/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Edad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Género/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Agregar/i })).toBeInTheDocument();
  });

  it("valida errores si los campos están mal", async () => {
    render(<AgregarSupervisor />);
    const button = screen.getByRole("button", { name: /Agregar/i });

    // Llenamos solo algunos campos
    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "a".repeat(151) },
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/El nombre no puede tener más de 150 caracteres./i)).toBeInTheDocument();
    });
  });

  it("envía el formulario correctamente", async () => {
    render(<AgregarSupervisor />);

    fireEvent.change(screen.getByLabelText(/CUI/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Juan Pérez" } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: "juan@example.com" } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: "555-1234" } });
    fireEvent.change(screen.getByLabelText(/Edad/i), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText(/Género/i), { target: { value: "Masculino" } });

    fireEvent.click(screen.getByRole("button", { name: /Agregar/i }));

    await waitFor(() => {
      expect(screen.getByText(/¡Supervisor agregado correctamente!/i)).toBeInTheDocument();
    });
  });
});
