// src/app/doctors/create/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateDoctor.module.css";
import { Doctor } from "../../types/Doctor";
import { useDoctor } from "../../hooks/useDoctor";
import { useSpecialty } from "../../hooks/useSpecialty";

export default function CreateDoctorPage() {
  const router = useRouter();
  const { doctors, addDoctor } = useDoctor();
  const { specialties } = useSpecialty();

  const [form, setForm] = useState<Doctor>({
    id: 0,
    name: "",
    crm: "",
    specialty: "",
    email: "",
    phone: "",
    isActive: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    let newValue: string | boolean = value;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      newValue = e.target.checked;
    }

    setForm(prev => ({
      ...prev,
      [name]: newValue,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
    const newDoctor: Doctor = { ...form, id: newId };
    addDoctor(newDoctor);
    router.push("/doctors");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastrar Médico</h1>
      <form className={styles.form} onSubmit={handleSubmit}>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">Nome</label>
          <input
            className={styles.formInput}
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="crm">CRM</label>
          <input
            className={styles.formInput}
            id="crm"
            name="crm"
            value={form.crm}
            onChange={handleChange}
            type="text"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="specialty">Especialidade</label>
          <select
            className={styles.formSelect}
            id="specialty"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma especialidade</option>
            {specialties.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">Email</label>
          <input
            className={styles.formInput}
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="phone">Telefone</label>
          <input
            className={styles.formInput}
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            required
          />
        </div>

        <label className={styles.checkboxLabel}>
          <input
            className={styles.checkboxInput}
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Ativo
        </label>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.buttonSubmit}>Salvar</button>
          <button
            type="button"
            className={styles.buttonCancel}
            onClick={() => router.push("/doctors")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
