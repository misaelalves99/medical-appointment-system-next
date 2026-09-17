export type DrizzleTransactionLike = {
  insert: (...args: any[]) => any;
};

export type DrizzleDatabaseLike = {
  transaction<T>(work: (tx: DrizzleTransactionLike) => Promise<T>): Promise<T>;
};

export function createDrizzleAppointmentOutboxTransaction(db: DrizzleDatabaseLike) {
  return {
    transaction<T>(work: (tx: DrizzleTransactionLike) => Promise<T>): Promise<T> {
      return db.transaction(work);
    },
  };
}
