// src/app/doctors/create/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateDoctor.module.css";
import { Doctor, doctorsMock } from "../../mocks/doctors";

export default function CreateDoctor() {
  const router = useRouter();

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

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newId =
      doctorsMock.length > 0
        ? Math.max(...doctorsMock.map((d) => d.id)) + 1
        : 1;

    doctorsMock.push({ ...form, id: newId });

    console.log("Novo médico adicionado:", { ...form, id: newId });
    console.log("Lista atualizada de médicos:", doctorsMock);

    router.push("/doctors");
  }

  return (
    <div className={styles.container}>
      <h1>Cadastrar Médico</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="crm">CRM</label>
          <input
            id="crm"
            name="crm"
            value={form.crm}
            onChange={handleChange}
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="specialty">Especialidade</label>
          <input
            id="specialty"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Telefone</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            required
          />
        </div>

        <div>
          <label htmlFor="isActive">Ativo</label>
          <input
            id="isActive"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            type="checkbox"
          />
        </div>

        <button type="submit">Salvar</button>
        <button type="button" onClick={() => router.push("/doctors")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
