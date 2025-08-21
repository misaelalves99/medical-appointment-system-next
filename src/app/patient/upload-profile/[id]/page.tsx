// src/app/patient/upload-profile/[id]/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../UploadProfilePicture.module.css";

interface UploadProfilePictureProps {
  onUpload: (file: File, patientId: number) => void;
}

export default function UploadProfilePicturePage({ onUpload }: UploadProfilePictureProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Paciente não encontrado</div>;

  const patientId = Number(id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile, patientId);
      setSelectedFile(null);
    }
  };

  return (
    <div className={styles.uploadProfileContainer}>
      <h1>Upload de Foto de Perfil do Paciente</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="hidden" name="id" value={patientId} />
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
