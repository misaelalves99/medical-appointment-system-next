import { fireEvent, render, screen } from '@testing-library/react';
import AppointmentList from './page';
import { useRouter } from 'next/navigation';
import { appointmentsMock } from '../mocks/appointments';
import { AppointmentStatus } from '../types/Appointment';
import * as usePatientHook from '../hooks/usePatient';
import * as useDoctorHook from '../hooks/useDoctor';
import type { PatientContextType } from '../contexts/PatientContext';
import type { DoctorContextType } from '../contexts/DoctorContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../hooks/useAppointments', () => ({
  useAppointments: jest.fn(() => ({ appointments: appointmentsMock })),
}));

const mockPatients = [
  {
    id: 10,
    name: 'Paciente 1',
    cpf: '111.111.111-11',
    dateOfBirth: '1990-01-01',
    email: 'paciente1@example.com',
    phone: '1111-1111',
    address: 'Rua A, 100',
  },
  {
    id: 11,
    name: 'Paciente 2',
    cpf: '222.222.222-22',
    dateOfBirth: '1992-02-02',
    email: 'paciente2@example.com',
    phone: '2222-2222',
    address: 'Rua B, 200',
  },
];

const mockDoctors = [
  {
    id: 20,
    name: 'Doutor 1',
    cpf: '333.333.333-33',
    dateOfBirth: '1980-03-03',
    email: 'doutor1@example.com',
    phone: '3333-3333',
    address: 'Rua C, 300',
    specialty: 'Cardiologia',
    crm: 'CRM123',
    isActive: true,
  },
  {
    id: 21,
    name: 'Doutor 2',
    cpf: '444.444.444-44',
    dateOfBirth: '1982-04-04',
    email: 'doutor2@example.com',
    phone: '4444-4444',
    address: 'Rua D, 400',
    specialty: 'Pediatria',
    crm: 'CRM456',
    isActive: true,
  },
];

const mockPatientContext: PatientContextType = {
  patients: mockPatients,
  addPatient: jest.fn(),
  updatePatient: jest.fn(),
  deletePatient: jest.fn(),
  updatePatientProfilePicture: jest.fn(),
};

const mockDoctorContext: DoctorContextType = {
  doctors: mockDoctors,
  addDoctor: jest.fn(),
  updateDoctor: jest.fn(),
  removeDoctor: jest.fn(),
};

describe('AppointmentList workspace', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    appointmentsMock.length = 0;
    appointmentsMock.push(
      {
        id: 1,
        patientId: 10,
        doctorId: 20,
        appointmentDate: '2025-08-22T10:00',
        status: AppointmentStatus.Scheduled,
        notes: '',
      },
      {
        id: 2,
        patientId: 11,
        doctorId: 21,
        appointmentDate: '2025-08-23T14:00',
        status: AppointmentStatus.Confirmed,
        notes: '',
      }
    );

    jest.spyOn(usePatientHook, 'usePatient').mockReturnValue(mockPatientContext);
    jest.spyOn(useDoctorHook, 'useDoctor').mockReturnValue(mockDoctorContext);
  });

  it('renders the appointment management workspace with domain data', () => {
    render(<AppointmentList />);

    expect(screen.getByRole('heading', { name: 'Gerenciamento de consultas' })).toBeInTheDocument();
    expect(screen.getByText('Paciente 1')).toBeInTheDocument();
    expect(screen.getByText('Doutor 1')).toBeInTheDocument();
    expect(screen.getByText('Paciente 2')).toBeInTheDocument();
    expect(screen.getByText('Doutor 2')).toBeInTheDocument();
    expect(screen.getByText('Agendada')).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
    expect(screen.getByText('2 consultas encontradas')).toBeInTheDocument();
  });

  it('renders a labelled search control and filters by patient', () => {
    render(<AppointmentList />);

    const searchInput = screen.getByRole('searchbox', { name: 'Pesquisar consultas' });
    fireEvent.change(searchInput, { target: { value: 'Paciente 2' } });

    expect(screen.queryByText('Paciente 1')).not.toBeInTheDocument();
    expect(screen.getByText('Paciente 2')).toBeInTheDocument();
    expect(screen.getByText('1 consulta encontrada')).toBeInTheDocument();
  });

  it('filters by doctor as part of the approved search contract', () => {
    render(<AppointmentList />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Pesquisar consultas' }), {
      target: { value: 'Doutor 1' },
    });

    expect(screen.getByText('Paciente 1')).toBeInTheDocument();
    expect(screen.queryByText('Paciente 2')).not.toBeInTheDocument();
  });

  it('shows a distinct no-results state for an unmatched search', () => {
    render(<AppointmentList />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Pesquisar consultas' }), {
      target: { value: 'consulta inexistente' },
    });

    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
    expect(screen.queryByText('Nenhuma consulta cadastrada')).not.toBeInTheDocument();
    expect(screen.getByText('0 consultas encontradas')).toBeInTheDocument();
  });

  it('shows the empty-domain state when no appointments exist', () => {
    appointmentsMock.length = 0;
    render(<AppointmentList />);

    expect(screen.getByText('Nenhuma consulta cadastrada')).toBeInTheDocument();
  });

  it('shows the loading state while patient or doctor boundaries are unavailable', () => {
    jest.spyOn(usePatientHook, 'usePatient').mockReturnValue({
      ...mockPatientContext,
      patients: [],
    });

    jest.spyOn(useDoctorHook, 'useDoctor').mockReturnValue({
      ...mockDoctorContext,
      doctors: [],
    });

    render(<AppointmentList />);

    expect(screen.getByText('Carregando informações da agenda...')).toBeInTheDocument();
  });

  it('navigates to appointment creation from the primary action', () => {
    render(<AppointmentList />);

    fireEvent.click(screen.getByRole('button', { name: 'Nova consulta' }));
    expect(pushMock).toHaveBeenCalledWith('/appointments/create');
  });

  it('exposes explicit accessible names for row actions and preserves routing', () => {
    render(<AppointmentList />);

    fireEvent.click(screen.getByRole('button', { name: 'Detalhes da consulta 1' }));
    expect(pushMock).toHaveBeenCalledWith('/appointments/details/1');

    fireEvent.click(screen.getByRole('button', { name: 'Editar consulta 1' }));
    expect(pushMock).toHaveBeenCalledWith('/appointments/edit/1');

    fireEvent.click(screen.getByRole('button', { name: 'Excluir consulta 1' }));
    expect(pushMock).toHaveBeenCalledWith('/appointments/delete/1');
  });

  it('routes confirm and cancel actions with the selected appointment identity', () => {
    render(<AppointmentList />);

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar consulta 1' }));
    expect(pushMock).toHaveBeenCalledWith('/appointments/confirm/1');

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar consulta 1' }));
    expect(pushMock).toHaveBeenCalledWith('/appointments/cancel/1');
  });
});
