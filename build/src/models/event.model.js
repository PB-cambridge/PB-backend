"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const school_model_1 = __importDefault(require("./school.model"));
const student_model_1 = __importDefault(require("./student.model"));
const result_model_1 = __importDefault(require("./result.model"));
const schoolEvent_model_1 = __importDefault(require("./schoolEvent.model"));
const event = {};
let Event = class Event extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], Event.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Event.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DOUBLE, allowNull: false }),
    __metadata("design:type", Object)
], Event.prototype, "registrationFee", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Event.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Event.prototype, "bannerImage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Event.prototype, "location", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => student_model_1.default),
    __metadata("design:type", Array)
], Event.prototype, "students", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => school_model_1.default, () => schoolEvent_model_1.default),
    __metadata("design:type", Array)
], Event.prototype, "schools", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => result_model_1.default),
    __metadata("design:type", Array)
], Event.prototype, "results", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }),
    __metadata("design:type", Object)
], Event.prototype, "dateTime", void 0);
Event = __decorate([
    (0, sequelize_typescript_1.Table)({ modelName: "Event" })
], Event);
// export default Event;
//# sourceMappingURL=event.model.js.map