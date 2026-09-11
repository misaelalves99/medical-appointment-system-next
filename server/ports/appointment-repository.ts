import type { AppointmentDto, CreateAppointmentCommand } from "../contracts/appointment";

export interface AppointmentRepository {
  createIfNoOverlap(input: CreateAppointmentCommand): Promise<AppointmentDto | null>;
}
