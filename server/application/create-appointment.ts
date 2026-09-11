import type {
  AppointmentDto,
  CreateAppointmentInput,
} from "../contracts/appointment";
import {
  AppointmentDomainError,
  assertAppointmentInvariant,
} from "../domain/appointment";
import type { AppointmentRepository } from "../ports/appointment-repository";

export class AppointmentConflictError extends Error {
  constructor() {
    super("Appointment conflicts with an existing appointment.");
    this.name = "AppointmentConflictError";
  }
}

export { AppointmentDomainError };

export function createAppointmentService(
  repository: AppointmentRepository,
) {
  return async (
    input: CreateAppointmentInput,
  ): Promise<AppointmentDto> => {
    assertAppointmentInvariant(input);

    const created = await repository.createIfNoOverlap(input);
    if (!created) {
      throw new AppointmentConflictError();
    }

    return created;
  };
}