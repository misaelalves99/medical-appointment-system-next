'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaInfoCircle, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import styles from './AppointmentList.module.css';
import { useAppointments } from '../hooks/useAppointments';
import { usePatient } from '../hooks/usePatient';
import { useDoctor } from '../hooks/useDoctor';
import { AppointmentStatus } from '../types/Appointment';
import { getAppointmentStatusLabel } from '../utils/enumHelpers';

const getStatusClassName = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return styles.statusScheduled;
    case AppointmentStatus.Confirmed:
      return styles.statusConfirmed;
    case AppointmentStatus.Cancelled:
      return styles.statusCancelled;
    case AppointmentStatus.Completed:
      return styles.statusCompleted;
    default:
      return '';
  }
};

export default function AppointmentList() {
  const { appointments } = useAppointments();
  const { patients } = usePatient();
  const { doctors } = useDoctor();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const appointmentsWithNames = useMemo(() => {
    if (!patients.length || !doctors.length) return [];

    return appointments.map((appointment) => {
      const patient = patients.find((item) => item.id === appointment.patientId);
      const doctor = doctors.find((item) => item.id === appointment.doctorId);
      const date = new Date(appointment.appointmentDate);

      return {
        ...appointment,
        patientName: patient?.name ?? `Paciente #${appointment.patientId}`,
        doctorName: doctor?.name ?? `Médico #${appointment.doctorId}`,
        dateStr: date.toLocaleDateString('pt-BR'),
        timeStr: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
    });
  }, [appointments, patients, doctors]);

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return appointmentsWithNames;

    return appointmentsWithNames.filter((appointment) => {
      const status = getAppointmentStatusLabel(appointment.status).toLowerCase();

      return (
        appointment.dateStr.includes(normalizedSearch) ||
        appointment.timeStr.includes(normalizedSearch) ||
        appointment.patientName.toLowerCase().includes(normalizedSearch) ||
        appointment.doctorName.toLowerCase().includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        String(appointment.id).includes(normalizedSearch)
      );
    });
  }, [appointmentsWithNames, search]);

  if (!patients.length || !doctors.length) {
    return (
      <section className={styles.statePanel} aria-live='polite'>
        <span className={styles.stateEyebrow}>Consultas</span>
        <strong>Carregando informações da agenda...</strong>
        <span>Os dados de pacientes e médicos estão sendo preparados.</span>
      </section>
    );
  }

  return (
    <section className={styles.workspace} aria-labelledby='appointments-workspace-title'>
      <div className={styles.workspaceHeader}>
        <div>
          <p className={styles.eyebrow}>Agenda clínica</p>
          <h2 id='appointments-workspace-title'>Gerenciamento de consultas</h2>
          <p className={styles.description}>
            Consulte a agenda, localize atendimentos e acesse as ações disponíveis para cada consulta.
          </p>
        </div>

        <button
          type='button'
          className={styles.createBtn}
          onClick={() => router.push('/appointments/create')}
        >
          <FaPlus aria-hidden='true' />
          <span>Nova consulta</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <label htmlFor='appointment-search' className={styles.searchLabel}>
            Pesquisar consultas
          </label>
          <div className={styles.searchControl}>
            <FaSearch aria-hidden='true' className={styles.searchIcon} />
            <input
              id='appointment-search'
              type='search'
              placeholder='ID, data, hora, paciente, médico ou status'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <span className={styles.resultCount} aria-live='polite'>
          {filteredAppointments.length === 1
            ? '1 consulta encontrada'
            : `${filteredAppointments.length} consultas encontradas`}
        </span>
      </div>

      {appointmentsWithNames.length === 0 ? (
        <div className={styles.emptyState}>
          <strong>Nenhuma consulta cadastrada</strong>
          <span>Crie a primeira consulta para começar a organizar a agenda.</span>
          <button type='button' onClick={() => router.push('/appointments/create')}>
            <FaPlus aria-hidden='true' />
            Nova consulta
          </button>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className={styles.emptyState} role='status'>
          <FaSearch aria-hidden='true' />
          <strong>Nenhum resultado encontrado</strong>
          <span>Tente outro termo de pesquisa para localizar uma consulta.</span>
        </div>
      ) : (
        <div className={styles.tablePanel}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope='col'>ID</th>
                  <th scope='col'>Data</th>
                  <th scope='col'>Hora</th>
                  <th scope='col'>Paciente</th>
                  <th scope='col'>Médico</th>
                  <th scope='col'>Status</th>
                  <th scope='col' className={styles.actionsHeading}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => {
                  const statusLabel = getAppointmentStatusLabel(appointment.status);

                  return (
                    <tr key={appointment.id}>
                      <td>
                        <span className={styles.idBadge}>#{appointment.id}</span>
                      </td>
                      <td>{appointment.dateStr}</td>
                      <td>{appointment.timeStr}</td>
                      <td>
                        <strong className={styles.primaryCell}>{appointment.patientName}</strong>
                      </td>
                      <td>{appointment.doctorName}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClassName(appointment.status)}`}>{statusLabel}</span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            type='button'
                            className={styles.iconBtn}
                            onClick={() => router.push(`/appointments/details/${appointment.id}`)}
                            aria-label={`Detalhes da consulta ${appointment.id}`}
                            title='Detalhes'
                          >
                            <FaInfoCircle aria-hidden='true' />
                          </button>
                          <button
                            type='button'
                            className={styles.iconBtn}
                            onClick={() => router.push(`/appointments/edit/${appointment.id}`)}
                            aria-label={`Editar consulta ${appointment.id}`}
                            title='Editar'
                          >
                            <FaEdit aria-hidden='true' />
                          </button>
                          <button
                            type='button'
                            className={`${styles.iconBtn} ${styles.deleteBtn}`}
                            onClick={() => router.push(`/appointments/delete/${appointment.id}`)}
                            aria-label={`Excluir consulta ${appointment.id}`}
                            title='Excluir'
                          >
                            <FaTrash aria-hidden='true' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
