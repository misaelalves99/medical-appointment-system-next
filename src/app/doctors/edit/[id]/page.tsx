// src/app/doctors/edit/[id]/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DoctorEdit.module.css";
import type { Doctor } from "../../../types/Doctor";
import { useDoctor } from "../../../hooks/useDoctor";
import { useSpecialty } from "../../../hooks/useSpecialty";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const { doctors, updateDoctor } = useDoctor();
  const { specialties } = useSpecialty();

  const doctorId = Number(id);

  const [form, setForm] = useState<Doctor>({
    id: doctorId,
    name: "",
    crm: "",
    specialty: "",
    email: "",
    phone: "",
    isActive: true,
  });

  useEffect(() => {
    const foundDoctor = doctors.find(d => d.id === doctorId);
    if (foundDoctor) {
      setForm(foundDoctor);
    }
  }, [doctorId, doctors]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | boolean = value;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      newValue = e.target.checked;
    }

    setForm(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateDoctor(form);
    router.push("/doctors");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Médico</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nome:</label>
          <input
            className={styles.formInput}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>CRM:</label>
          <input
            className={styles.formInput}
            type="text"
            name="crm"
            value={form.crm}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Especialidade:</label>
          <select
            className={styles.formSelect}
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
          <label className={styles.formLabel}>Email:</label>
          <input
            className={styles.formInput}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Telefone:</label>
          <input
            className={styles.formInput}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
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
          <button type="submit" className={styles.buttonSubmit}>
            Salvar Alterações
          </button>
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
