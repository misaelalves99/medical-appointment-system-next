// src/app/doctors/edit/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../DoctorEdit.module.css";
import { doctorsMock, Doctor } from "../../../mocks/doctors";

export default function DoctorEditPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id ? Number(params.id) : undefined;

  const [form, setForm] = useState<Doctor | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = doctorsMock.find((d) => d.id === idParam) || null;
      setForm(found);
    }
  }, [idParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !idParam) return;

    const idx = doctorsMock.findIndex((d) => d.id === idParam);
    if (idx !== -1) doctorsMock[idx] = form;

    router.push("/doctors");
  };

  const handleCancel = () => {
    router.push("/doctors");
  };

  if (!form) return <p>Carregando médico...</p>;

  return (
    <div className={styles.container}>
      <h1>Editar Médico</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Nome:
          <input
            className={styles.inputText}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label className={styles.label}>
          CRM:
          <input
            className={styles.inputText}
            type="text"
            name="crm"
            value={form.crm}
            onChange={handleChange}
          />
        </label>

        <label className={styles.label}>
          Especialidade:
          <input
            className={styles.inputText}
            type="text"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
          />
        </label>

        <label className={styles.label}>
          Email:
          <input
            className={styles.inputEmail}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label className={styles.label}>
          Telefone:
          <input
            className={styles.inputTel}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label className={`${styles.label} ${styles.checkboxLabel}`}>
          Ativo:
          <input
            className={styles.checkboxInput}
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
        </label>

        <button className={styles.submitButton} type="submit">
          Salvar Alterações
        </button>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={handleCancel}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
