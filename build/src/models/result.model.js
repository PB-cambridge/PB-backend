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
const student_model_1 = __importDefault(require("./student.model"));
const school_model_1 = __importDefault(require("./school.model"));
const event_model_1 = __importDefault(require("./event.model"));
const userResult = {};
let StudentResult = class StudentResult extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", Object)
], StudentResult.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => student_model_1.default),
    __metadata("design:type", student_model_1.default)
], StudentResult.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => student_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], StudentResult.prototype, "studentRegNo", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => school_model_1.default),
    __metadata("design:type", school_model_1.default)
], StudentResult.prototype, "school", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => school_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }),
    __metadata("design:type", Object)
], StudentResult.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => event_model_1.default),
    __metadata("design:type", event_model_1.default)
], StudentResult.prototype, "event", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => event_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }),
    __metadata("design:type", Object)
], StudentResult.prototype, "eventId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.NUMBER }),
    __metadata("design:type", Object)
], StudentResult.prototype, "reading", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.NUMBER }),
    __metadata("design:type", Object)
], StudentResult.prototype, "writing", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.NUMBER }),
    __metadata("design:type", Object)
], StudentResult.prototype, "mathematics", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.NUMBER }),
    __metadata("design:type", Object)
], StudentResult.prototype, "total", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.NUMBER }),
    __metadata("design:type", Object)
], StudentResult.prototype, "position", void 0);
StudentResult = __decorate([
    (0, sequelize_typescript_1.Table)({ modelName: "StudentResult" })
], StudentResult);
exports.default = StudentResult;
//# sourceMappingURL=result.model.js.map