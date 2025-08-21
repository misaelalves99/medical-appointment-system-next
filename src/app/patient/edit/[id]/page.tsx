// src/app/patient/edit/[id]/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../EditPatient.module.css";

interface PatientEditForm {
  id: number;
  name: string;
  cpf: string;
  dateOfBirth: string; // ISO date string
  email: string;
  phone: string;
  address: string;
}

interface EditPatientPageProps {
  params: { id: string }; // Next.js dynamic route param
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  const router = useRouter();

  // Simulação de dados iniciais — substituir por fetch real
  const initialData: PatientEditForm = {
    id: Number(params.id),
    name: "João da Silva",
    cpf: "111.111.111-11",
    dateOfBirth: "2000-01-15",
    email: "joao@email.com",
    phone: "9999-9999",
    address: "Rua A, 123",
  };

  const [formData, setFormData] = useState<PatientEditForm>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aqui você pode chamar a API para salvar alterações
    console.log("Dados salvos:", formData);
    router.push("/patient");
  };

  return (
    <div className={styles.editPatientContainer}>
      <h1>Editar Paciente</h1>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={formData.id} />

        <div>
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="cpf">CPF:</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth">Data de Nascimento:</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone">Telefone:</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="address">Endereço:</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Salvar Alterações</button>
      </form>

      <button className={styles.back} onClick={() => router.push("/patient")}>
        Voltar
      </button>
    </div>
  );
}
