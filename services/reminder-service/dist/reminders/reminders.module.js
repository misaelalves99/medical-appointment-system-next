"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersModule = void 0;
const common_1 = require("@nestjs/common");
const in_memory_reminder_repository_1 = require("./adapters/in-memory-reminder.repository");
const reminder_repository_port_1 = require("./application/ports/reminder-repository.port");
const schedule_reminder_1 = require("./application/schedule-reminder");
const reminders_controller_1 = require("./http/reminders.controller");
let RemindersModule = class RemindersModule {
};
exports.RemindersModule = RemindersModule;
exports.RemindersModule = RemindersModule = __decorate([
    (0, common_1.Module)({
        controllers: [reminders_controller_1.RemindersController],
        providers: [
            schedule_reminder_1.ScheduleReminder,
            {
                provide: reminder_repository_port_1.REMINDER_REPOSITORY,
                useClass: in_memory_reminder_repository_1.InMemoryReminderRepository,
            },
        ],
    })
], RemindersModule);
//# sourceMappingURL=reminders.module.js.map