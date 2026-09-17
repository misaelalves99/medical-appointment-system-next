export type AppointmentOutboxTransaction = {
  insertAppointment(): Promise<void>;
  insertOutboxEvent(): Promise<void>;
};

export type TransactionalDatabase = {
  transaction(work: (tx: AppointmentOutboxTransaction) => Promise<void>): Promise<void>;
};

type Input = {
  appointment: { id: string };
  event: { id: string; eventType: string };
};

export async function persistAppointmentWithOutbox(
  database: TransactionalDatabase,
  _input: Input,
): Promise<void> {
  await database.transaction(async (tx) => {
    await tx.insertAppointment();
    await tx.insertOutboxEvent();
  });
}
