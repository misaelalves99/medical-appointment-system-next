// src/app/patient/create/page.tsx

"use client";

import { useState, FormEvent } from "react";
import styles from "./CreatePatient.module.css";

interface PatientCreateForm {
  name: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  phone: string;
  email: string;
}

const CreatePatient: React.FC = () => {
  const [formData, setFormData] = useState<PatientCreateForm>({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
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

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default CreatePatient;
