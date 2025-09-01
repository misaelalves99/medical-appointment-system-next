// src/app/patient/edit/[id]/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../EditPatient.module.css";
import type { PatientForm } from "../../../types/PatientForm";
import type { Patient } from "../../../types/Patient";
import { usePatient } from "../../../hooks/usePatient";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { patients, updatePatient } = usePatient();

  const patientId = params.id ? Number(params.id) : null;
  const existingPatient = patientId
    ? patients.find((p) => p.id === patientId) || null
    : null;

  const [formData, setFormData] = useState<PatientForm>({
    name: "",
    cpf: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  useEffect(() => {
    if (existingPatient) {
      setFormData({
        name: existingPatient.name || "",
        cpf: existingPatient.cpf || "",
        dateOfBirth: existingPatient.dateOfBirth || "",
        email: existingPatient.email || "",
        phone: existingPatient.phone || "",
        address: existingPatient.address || "",
        gender: existingPatient.gender || "",
      });
    }
  }, [existingPatient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!existingPatient) return;

    const updatedPatient: Patient = {
      id: existingPatient.id,
      ...formData,
      gender: formData.gender || undefined,
    };

    updatePatient(updatedPatient);
    router.push("/patient");
  };

  if (!existingPatient) {
    return (
      <div className={styles.editPatientContainer}>
        <h1 className={styles.title}>Editar Paciente</h1>
        <p className={styles.notFoundMessage}>Paciente não encontrado.</p>
        <button className={styles.buttonCancel} onClick={() => router.push("/patient")}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editPatientContainer}>
      <h1 className={styles.title}>Editar Paciente</h1>
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
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.buttonSubmit}>Salvar Alterações</button>
          <button type="button" className={styles.buttonCancel} onClick={() => router.push("/patient")}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
