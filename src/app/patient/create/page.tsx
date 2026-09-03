"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { usePatient } from "../../hooks/usePatient";
import type { Patient } from "../../types/Patient";
import type { PatientForm } from "../../types/PatientForm";
import styles from "./CreatePatient.module.css";

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const newId = patients.length > 0 ? Math.max(...patients.map((patient) => patient.id)) + 1 : 1;
    const newPatient: Patient = { ...formData, id: newId };

    addPatient(newPatient);
    router.push("/patient");
  };

  return (
    <section className={styles.workspace} aria-labelledby="create-patient-title">
      <button
        type="button"
        className={styles.backLink}
        onClick={() => router.push("/patient")}
      >
        <FaArrowLeft aria-hidden="true" />
        Voltar para pacientes
      </button>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Cadastro clínico</p>
        <h1 id="create-patient-title">Cadastrar paciente</h1>
        <p className={styles.description}>
          Preencha os dados essenciais para incluir um paciente no cadastro.
        </p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formHeading}>
          <div>
            <h2>Dados do paciente</h2>
            <p>Campos marcados com <span aria-hidden="true">*</span> são obrigatórios.</p>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome <span aria-hidden="true">*</span></label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              aria-describedby="name-help"
            />
            <span id="name-help" className={styles.helperText}>Nome completo do paciente.</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cpf">CPF <span aria-hidden="true">*</span></label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              value={formData.cpf}
              onChange={handleChange}
              required
              aria-describedby="cpf-help"
            />
            <span id="cpf-help" className={styles.helperText}>Documento usado para identificar o cadastro.</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dateOfBirth">Data de nascimento <span aria-hidden="true">*</span></label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender">Sexo <span aria-hidden="true">*</span></label>
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

          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="address">Endereço <span aria-hidden="true">*</span></label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={() => router.push("/patient")}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton}>
            <FaSave aria-hidden="true" />
            Salvar paciente
          </button>
        </div>
      </form>
    </section>
  );
}
