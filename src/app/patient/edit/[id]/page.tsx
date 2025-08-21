// src/app/patient/edit/[id]/page.tsx

"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../EditPatient.module.css";
import { patientsMock, Patient } from "../../../mocks/patients";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const [formData, setFormData] = useState<Patient | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = patientsMock.find((p) => p.id === idParam) || null;
      setFormData(found);
    }
  }, [idParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !idParam) return;

    const idx = patientsMock.findIndex((p) => p.id === idParam);
    if (idx !== -1) patientsMock[idx] = formData;

    console.log("Paciente atualizado:", formData);
    router.push("/patient");
  };

  if (!formData) return <p>Carregando paciente...</p>;

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
            value={formData.cpf || ""}
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
