import type { CreateAppointmentInput } from "../contracts/appointment";

export class AppointmentDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppointmentDomainError";
  }
}

export function assertAppointmentInvariant(
  input: CreateAppointmentInput,
): void {
  const start = new Date(input.startAt);
  const end = new Date(input.endAt);

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    throw new AppointmentDomainError("Appointment dates must be valid.");
  }

  if (start.getTime() >= end.getTime()) {
    throw new AppointmentDomainError(
      "Appointment start must be before appointment end.",
    );
  }
}