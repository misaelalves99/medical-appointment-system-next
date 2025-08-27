// src/app/patient/create/page.tsx

"use client";

import { useState, FormEvent } from "react";
import styles from "./CreatePatient.module.css";
import { patientsMock, Patient } from "../../mocks/patients";
import { useRouter } from "next/navigation";

interface PatientCreateForm {
  name: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  phone: string;
  email: string;
  cpf: string;
}

export default function CreatePatientPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<PatientCreateForm>({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    cpf: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      id: patientsMock.length + 1,
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      cpf: formData.cpf,
      address: "", // endereço opcional
    };

    patientsMock.push(newPatient); // adiciona ao mock
    console.log("Novo paciente cadastrado:", newPatient);
    router.push("/patient"); // redireciona para listagem
  };

  return (
    <div className={styles.createPatientContainer}>
      <h1>Cadastrar Paciente</h1>

      <form onSubmit={handleSubmit}>
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
          <label htmlFor="gender">Sexo:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div>
          <label htmlFor="phone">Telefone:</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
