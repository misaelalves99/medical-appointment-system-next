// src/components/Footer.tsx

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      MedicalAppointmentSystem &copy; {new Date().getFullYear()}
    </footer>
  );
}
