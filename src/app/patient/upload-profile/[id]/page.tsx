"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaImage, FaUpload } from "react-icons/fa";
import styles from "../UploadProfilePicture.module.css";
import { patientsMock } from "../../../mocks/patients";

export default function UploadProfilePicturePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  if (!idParam) {
    return <div className={styles.notFound}>Paciente não encontrado</div>;
  }

  const patient = patientsMock.find((item) => item.id === idParam);

  if (!patient) {
    return <div className={styles.notFound}>Paciente não encontrado</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Demo-only interaction: no file or patient data is persisted or transmitted.
    alert("Simulação concluída. Nenhum arquivo foi armazenado.");

    setSelectedFile(null);
    router.push("/patient");
  };

  return (
    <section className={styles.workspace} aria-labelledby="upload-profile-title">
      <button type="button" className={styles.backLink} onClick={() => router.push("/patient")}>
        <FaArrowLeft aria-hidden="true" />
        Voltar
      </button>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Cadastro clínico</p>
        <h1 id="upload-profile-title">Simulação de Foto de Perfil</h1>
        <p className={styles.description}>
          Demonstração local de seleção de imagem. Nenhum arquivo é enviado ou armazenado.
        </p>
      </div>

      <div className={styles.uploadCard}>
        <div className={styles.patientIdentity}>
          <div className={styles.patientIcon} aria-hidden="true">
            <FaImage />
          </div>
          <div>
            <span>Paciente</span>
            <strong>{patient.name}</strong>
            <small>Identificador #{patient.id}</small>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="id" value={patient.id} />

          <div className={styles.fieldGroup}>
            <label htmlFor="profilePicture">Selecionar Foto:</label>
            <p id="profile-picture-help" className={styles.helperText}>
              Selecione um arquivo de imagem disponível no dispositivo.
            </p>
            <input
              className={styles.fileInput}
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              aria-describedby="profile-picture-help selected-file-status"
              onChange={handleFileChange}
            />
          </div>

          <div id="selected-file-status" className={styles.fileStatus} aria-live="polite">
            {selectedFile ? (
              <>Arquivo selecionado: <strong>{selectedFile.name}</strong></>
            ) : (
              "Nenhum arquivo selecionado."
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => router.push("/patient")}
            >
              Voltar
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={!selectedFile}
            >
              <FaUpload aria-hidden="true" />
              Simular envio
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
