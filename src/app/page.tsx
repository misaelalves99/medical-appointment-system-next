'use client';

import Link from 'next/link';
import {
  FaArrowRight,
  FaCalendarCheck,
  FaPlus,
  FaStethoscope,
  FaUserInjured,
  FaUserMd,
} from 'react-icons/fa';
import { useAppointments } from './hooks/useAppointments';
import { useDoctor } from './hooks/useDoctor';
import { usePatient } from './hooks/usePatient';
import { useSpecialty } from './hooks/useSpecialty';
import { getAppointmentStatusLabel } from './utils/enumHelpers';
import styles from './HomePage.module.css';

export default function Home() {
  const { appointments } = useAppointments();
  const { patients } = usePatient();
  const { doctors } = useDoctor();
  const { specialties } = useSpecialty();

  const stats = [
    {
      label: 'Consultas',
      value: appointments.length,
      href: '/appointments',
      detail: 'Acompanhar agenda',
      icon: FaCalendarCheck,
    },
    {
      label: 'Pacientes',
      value: patients.length,
      href: '/patient',
      detail: 'Gerenciar pacientes',
      icon: FaUserInjured,
    },
    {
      label: 'Médicos',
      value: doctors.length,
      href: '/doctors',
      detail: 'Gerenciar equipe',
      icon: FaUserMd,
    },
    {
      label: 'Especialidades',
      value: specialties.length,
      href: '/specialty',
      detail: 'Ver especialidades',
      icon: FaStethoscope,
    },
  ];

  const highlightedAppointments = appointments.slice(0, 4);

  return (
    <div className={styles.dashboard}>
      <section className={styles.intro} aria-labelledby='overview-heading'>
        <div>
          <p className={styles.kicker}>Visão operacional</p>
          <h2 id='overview-heading'>Visão geral do sistema</h2>
          <p className={styles.introText}>
            Acompanhe os principais cadastros e acesse rapidamente as rotinas de agendamento.
          </p>
        </div>
        <Link href='/appointments/create' className={styles.primaryAction}>
          <FaPlus aria-hidden='true' />
          <span>Nova consulta</span>
        </Link>
      </section>

      <section className={styles.statsGrid} aria-label='Indicadores operacionais'>
        {stats.map(({ label, value, href, detail, icon: Icon }) => (
          <Link key={label} href={href} className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}>
                <Icon aria-hidden='true' />
              </span>
              <span className={styles.statValue}>{value}</span>
            </div>
            <div>
              <h3>{label}</h3>
              <span className={styles.statDetail}>
                {detail}
                <FaArrowRight aria-hidden='true' />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <div className={styles.dashboardGrid}>
        <section className={styles.panel} aria-labelledby='appointments-heading'>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelKicker}>Agenda</p>
              <h2 id='appointments-heading'>Consultas em destaque</h2>
            </div>
            <Link href='/appointments' className={styles.textLink}>
              Ver todas
              <FaArrowRight aria-hidden='true' />
            </Link>
          </div>

          {highlightedAppointments.length === 0 ? (
            <div className={styles.emptyState}>
              <FaCalendarCheck aria-hidden='true' />
              <strong>Nenhuma consulta cadastrada</strong>
              <span>Crie a primeira consulta para iniciar a agenda.</span>
              <Link href='/appointments/create'>Nova consulta</Link>
            </div>
          ) : (
            <div className={styles.appointmentList}>
              {highlightedAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments/details/${appointment.id}`}
                  className={styles.appointmentRow}
                >
                  <div className={styles.appointmentIdentity}>
                    <span className={styles.appointmentMark} aria-hidden='true'>
                      {String(appointment.patientName ?? 'P').trim().charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <strong>{appointment.patientName || `Paciente #${appointment.patientId}`}</strong>
                      <span>{appointment.doctorName || `Médico #${appointment.doctorId}`}</span>
                    </div>
                  </div>
                  <span className={styles.statusBadge}>{getAppointmentStatusLabel(appointment.status)}</span>
                  <FaArrowRight className={styles.rowArrow} aria-hidden='true' />
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className={styles.panel} aria-labelledby='quick-actions-heading'>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelKicker}>Atalhos</p>
              <h2 id='quick-actions-heading'>Ações rápidas</h2>
            </div>
          </div>

          <div className={styles.quickActions}>
            <Link href='/appointments/create' className={styles.quickAction}>
              <span className={styles.quickIcon}><FaCalendarCheck aria-hidden='true' /></span>
              <span><strong>Nova consulta</strong><small>Agendar atendimento</small></span>
              <FaArrowRight aria-hidden='true' />
            </Link>
            <Link href='/patient/create' className={styles.quickAction}>
              <span className={styles.quickIcon}><FaUserInjured aria-hidden='true' /></span>
              <span><strong>Novo paciente</strong><small>Adicionar cadastro</small></span>
              <FaArrowRight aria-hidden='true' />
            </Link>
            <Link href='/doctors/create' className={styles.quickAction}>
              <span className={styles.quickIcon}><FaUserMd aria-hidden='true' /></span>
              <span><strong>Novo médico</strong><small>Adicionar profissional</small></span>
              <FaArrowRight aria-hidden='true' />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
