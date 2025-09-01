// src/app/patient/create/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreatePatient.module.css";
import { PatientForm } from "../../types/PatientForm";
import { Patient } from "../../types/Patient";
import { usePatient } from "../../hooks/usePatient";

export default function CreatePatientPage() {
  const { patients, addPatient } = usePatient();
  const router = useRouter();

  const [formData, setFormData] = useState<PatientForm>({
    name: "",
    cpf: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const newPatient: Patient = { ...formData, id: newId };

    addPatient(newPatient);
    router.push("/patient");
  };

  return (
    <div className={styles.createPatientContainer}>
      <h1 className={styles.title}>Cadastrar Paciente</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">Nome:</label>
          <input
            className={styles.formInput}
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="cpf">CPF:</label>
          <input
            className={styles.formInput}
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="dateOfBirth">Data de Nascimento:</label>
          <input
            className={styles.formInput}
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="gender">Sexo:</label>
          <select
            className={styles.formSelect}
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

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="phone">Telefone:</label>
          <input
            className={styles.formInput}
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">Email:</label>
          <input
            className={styles.formInput}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="address">Endereço:</label>
          <input
            className={styles.formInput}
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.buttonSubmit}>Salvar</button>
          <button type="button" className={styles.buttonCancel} onClick={() => router.push("/patient")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
