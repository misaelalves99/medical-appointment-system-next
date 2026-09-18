import type { AppointmentDto, CreateAppointmentCommand } from "../contracts/appointment";

export interface AppointmentRepository {
  createIfNoOverlap(input: CreateAppointmentCommand): Promise<AppointmentDto | null>;
  findByIdForPrincipal(id: string, principalId: string): Promise<AppointmentDto | null>;
}
