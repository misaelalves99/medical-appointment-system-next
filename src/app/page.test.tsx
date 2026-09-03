import { render, screen } from '@testing-library/react';
import Home from './page';
import { useAppointments } from './hooks/useAppointments';
import { useDoctor } from './hooks/useDoctor';
import { usePatient } from './hooks/usePatient';
import { useSpecialty } from './hooks/useSpecialty';
import { AppointmentStatus } from './types/Appointment';

jest.mock('./hooks/useAppointments', () => ({ useAppointments: jest.fn() }));
jest.mock('./hooks/useDoctor', () => ({ useDoctor: jest.fn() }));
jest.mock('./hooks/usePatient', () => ({ usePatient: jest.fn() }));
jest.mock('./hooks/useSpecialty', () => ({ useSpecialty: jest.fn() }));

const mockUseAppointments = useAppointments as jest.MockedFunction<typeof useAppointments>;
const mockUseDoctor = useDoctor as jest.MockedFunction<typeof useDoctor>;
const mockUsePatient = usePatient as jest.MockedFunction<typeof usePatient>;
const mockUseSpecialty = useSpecialty as jest.MockedFunction<typeof useSpecialty>;

describe('Operational dashboard Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppointments.mockReturnValue({
      appointments: [
        {
          id: 1,
          patientId: 1,
          doctorId: 2,
          patientName: 'Carlos Oliveira',
          doctorName: 'Dra. Ana Paula',
          status: AppointmentStatus.Confirmed,
        },
      ],
    } as unknown as ReturnType<typeof useAppointments>);

    mockUsePatient.mockReturnValue({
      patients: [{ id: 1 }, { id: 2 }],
    } as unknown as ReturnType<typeof usePatient>);

    mockUseDoctor.mockReturnValue({
      doctors: [{ id: 1 }, { id: 2 }],
    } as unknown as ReturnType<typeof useDoctor>);

    mockUseSpecialty.mockReturnValue({
      specialties: [{ id: 1 }, { id: 2 }],
    } as unknown as ReturnType<typeof useSpecialty>);
  });

  it('renders provider-backed operational indicators', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'Visão geral do sistema' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /1 Consultas Acompanhar agenda/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2 Pacientes Gerenciar pacientes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2 Médicos Gerenciar equipe/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2 Especialidades Ver especialidades/i })).toBeInTheDocument();
  });

  it('renders appointment overview from the appointment boundary', () => {
    render(<Home />);

    expect(screen.getByText('Carlos Oliveira')).toBeInTheDocument();
    expect(screen.getByText('Dra. Ana Paula')).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Carlos Oliveira/i })).toHaveAttribute(
      'href',
      '/appointments/details/1'
    );
  });

  it('exposes the approved quick actions', () => {
    render(<Home />);

    expect(screen.getAllByRole('link', { name: /Nova consulta/i })[0]).toHaveAttribute(
      'href',
      '/appointments/create'
    );
    expect(screen.getByRole('link', { name: /Novo paciente/i })).toHaveAttribute(
      'href',
      '/patient/create'
    );
    expect(screen.getByRole('link', { name: /Novo médico/i })).toHaveAttribute(
      'href',
      '/doctors/create'
    );
  });
});
