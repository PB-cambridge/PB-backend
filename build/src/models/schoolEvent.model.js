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
const event_model_1 = __importDefault(require("./event.model"));
// @Table
// class Book extends Model {
// 	@BelongsToMany(() => Author, () => BookAuthor)
// 	authors: Author[];
// }
// @Table
// class Author extends Model {
// 	@BelongsToMany(() => Book, () => BookAuthor)
// 	books: Book[];
// }
let SchoolEvent = class SchoolEvent extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => school_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SchoolEvent.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => event_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SchoolEvent.prototype, "eventId", void 0);
SchoolEvent = __decorate([
    sequelize_typescript_1.Table
], SchoolEvent);
// export default SchoolEvent;
//# sourceMappingURL=schoolEvent.model.js.map