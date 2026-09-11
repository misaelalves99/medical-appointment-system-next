import type {
  AppointmentDto,
  CreateAppointmentInput,
} from "../contracts/appointment";

export interface AppointmentRepository {
  createIfNoOverlap(
    input: CreateAppointmentInput,
  ): Promise<AppointmentDto | null>;
}