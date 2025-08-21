// src/app/patient/upload-profile/[id]/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../UploadProfilePicture.module.css";
import { patientsMock } from "../../../mocks/patients";

export default function UploadProfilePicturePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  if (!idParam) return <div>Paciente não encontrado</div>;

  // Simula encontrar o paciente
  const patient = patientsMock.find((p) => p.id === idParam);
  if (!patient) return <div>Paciente não encontrado</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Simula upload
    console.log("Arquivo enviado para paciente:", patient.id, selectedFile);
    alert(`Foto enviada para o paciente ${patient.name}!`);

    setSelectedFile(null);
    router.push("/patient");
  };

  return (
    <div className={styles.uploadProfileContainer}>
      <h1>Upload de Foto de Perfil</h1>
      <p><strong>Paciente:</strong> {patient.name}</p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="hidden" name="id" value={patient.id} />

        <div>
          <label htmlFor="profilePicture">Selecionar Foto:</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={!selectedFile}>
          Enviar Foto
        </button>
      </form>

      <button className={styles.back} onClick={() => router.push("/patient")}>
        Voltar
      </button>
    </div>
  );
}
