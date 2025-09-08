// src/hooks/useAppointments.ts

import { useContext } from "react";
import { AppointmentsContext } from "../contexts/AppointmentsContext";

export const useAppointments = () => useContext(AppointmentsContext);
