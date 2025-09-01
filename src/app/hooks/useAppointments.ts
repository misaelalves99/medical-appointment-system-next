// src/hooks/useAppointments.tsx

import { useContext } from 'react';
import { AppointmentsContext } from '../contexts/AppointmentsContext';

export const useAppointments = () => {
  return useContext(AppointmentsContext);
};
