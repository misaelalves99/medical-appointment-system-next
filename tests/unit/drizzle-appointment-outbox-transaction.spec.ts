import {
  createDrizzleAppointmentOutboxTransaction,
  type DrizzleDatabaseLike,
  type DrizzleTransactionLike,
} from "../../server/adapters/postgres/drizzle-appointment-outbox-transaction";

describe("createDrizzleAppointmentOutboxTransaction", () => {
  it("delegates one callback to the Drizzle transaction API", async () => {
    const tx: DrizzleTransactionLike = {
      insert: jest.fn(),
    };

    const transactionMock = jest.fn(
      async (work: (value: DrizzleTransactionLike) => Promise<unknown>) => work(tx),
    );

    const db: DrizzleDatabaseLike = {
      transaction: <T>(work: (value: DrizzleTransactionLike) => Promise<T>) =>
        transactionMock(work) as Promise<T>,
    };

    const boundary = createDrizzleAppointmentOutboxTransaction(db);
    const work = jest.fn(async () => undefined);

    await boundary.transaction(work);

    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(work).toHaveBeenCalledTimes(1);
    expect(work).toHaveBeenCalledWith(tx);
  });
});
