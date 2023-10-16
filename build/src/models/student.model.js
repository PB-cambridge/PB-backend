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
exports.generateRegistrationNumber = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const result_model_1 = __importDefault(require("./result.model"));
const school_model_1 = __importDefault(require("./school.model"));
const student = {};
let Student = class Student extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", Object)
], Student.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Student.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Student.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", Object)
], Student.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Student.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", Object)
], Student.prototype, "phoneNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => school_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Student.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => school_model_1.default),
    __metadata("design:type", school_model_1.default)
], Student.prototype, "school", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("Junior", "Senior", "Graduated"),
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Student.prototype, "level", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM("Science", "Art"), allowNull: false }),
    __metadata("design:type", Object)
], Student.prototype, "scienceOrArt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Student.prototype, "passport", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => result_model_1.default),
    __metadata("design:type", Array)
], Student.prototype, "results", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", Object)
], Student.prototype, "whatsappNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], Student.prototype, "registrationNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Object)
], Student.prototype, "acknowledgementSent", void 0);
Student = __decorate([
    (0, sequelize_typescript_1.Table)({ modelName: "Student" })
], Student);
exports.default = Student;
function generateRegistrationNumber() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let registrationNumber = "";
    // Generate three random letters
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        registrationNumber += letters[randomIndex];
    }
    // Generate four random numbers
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        registrationNumber += numbers[randomIndex];
    }
    return registrationNumber;
}
exports.generateRegistrationNumber = generateRegistrationNumber;
//# sourceMappingURL=student.model.js.map