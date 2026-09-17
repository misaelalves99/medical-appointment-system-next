import { Module } from "@nestjs/common";
import { RemindersModule } from "./reminders/reminders.module";

@Module({
  imports: [RemindersModule],
})
export class AppModule {}
