"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./CreateDoctor.module.css";
import { useDoctor } from "../../hooks/useDoctor";
import { useSpecialty } from "../../hooks/useSpecialty";
import type { Doctor } from "../../types/Doctor";

export default function CreateDoctor() {
  const router = useRouter();
  const { doctors, addDoctor } = useDoctor();
  const { specialties } = useSpecialty();

  const [name, setName] = useState("");
  const [crm, setCrm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newDoctor: Doctor = {
      id: doctors.length > 0 ? Math.max(...doctors.map((doctor) => doctor.id)) + 1 : 1,
      name,
      crm,
      specialty,
      email,
      phone,
      isActive,
    };

    addDoctor(newDoctor);
    router.push("/doctors");
  };

  return (
    <section className={styles.workspace} aria-labelledby="create-doctor-title">
      <Link href="/doctors" className={styles.backLink}>
        ← Voltar para médicos
      </Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Equipe clínica</p>
        <h1 id="create-doctor-title">Cadastrar médico</h1>
        <p>
          Registre os dados profissionais e a disponibilidade do médico.
        </p>
      </header>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formHeading}>
          <div>
            <h2>Dados do médico</h2>
            <p>Preencha os campos necessários para o cadastro profissional.</p>
          </div>
          <p className={styles.requiredGuide}>
            <span aria-hidden="true">*</span> Campos obrigatórios
          </p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="doctor-name">
              Nome <span aria-hidden="true">*</span>
            </label>
            <input
              id="doctor-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-describedby="doctor-name-help"
              required
            />
            <small id="doctor-name-help">Informe o nome profissional completo.</small>
          </div>

          <div className={styles.field}>
            <label htmlFor="doctor-crm">
              CRM <span aria-hidden="true">*</span>
            </label>
            <input
              id="doctor-crm"
              value={crm}
              onChange={(event) => setCrm(event.target.value)}
              aria-describedby="doctor-crm-help"
              required
            />
            <small id="doctor-crm-help">Informe o registro profissional do médico.</small>
          </div>

          <div className={styles.field}>
            <label htmlFor="doctor-specialty">
              Especialidade <span aria-hidden="true">*</span>
            </label>
            <select
              id="doctor-specialty"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              required
            >
              <option value="">Selecione uma especialidade</option>
              {specialties.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="doctor-email">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="doctor-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="doctor-phone">
              Telefone <span aria-hidden="true">*</span>
            </label>
            <input
              id="doctor-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>

          <div className={`${styles.field} ${styles.checkboxField}`}>
            <label className={styles.checkboxLabel} htmlFor="doctor-active">
              <input
                id="doctor-active"
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              Médico ativo
            </label>
            <small>Indica se o profissional está disponível no cadastro.</small>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => router.push("/doctors")}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.primaryAction}>
            Salvar médico
          </button>
        </div>
      </form>
    </section>
  );
}
