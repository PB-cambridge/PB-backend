"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const school_model_1 = __importDefault(require("./school.model"));
const faker_1 = require("@faker-js/faker");
const student_model_1 = __importDefault(require("./student.model"));
const result_model_1 = __importDefault(require("./result.model"));
const error_controller_1 = require("../controllers/error.controller");
const event_model_1 = __importDefault(require("./event.model"));
const NUM_OF = {
    SCHOOL: 5,
    USER: 5,
    USER_RESULT: 2,
    EVENTS: 2,
};
const seedDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield seedEvent();
    const schools = yield seedSchool();
    const student = yield seedStudent();
    // await seedResult();
    function seedEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            const events = [];
            for (let i = 0; i < NUM_OF.EVENTS; i++) {
                const event = yield event_model_1.default.create({
                    title: faker_1.faker.internet.displayName(),
                    bannerImage: faker_1.faker.internet.avatar(),
                    dateTime: faker_1.faker.date.future(),
                    description: faker_1.faker.lorem.sentence(),
                    location: faker_1.faker.location.secondaryAddress(),
                    registrationFee: +faker_1.faker.commerce.price({ dec: 2 }),
                });
                events.push(event);
            }
            return events;
        });
    }
    function seedSchool() {
        return __awaiter(this, void 0, void 0, function* () {
            const schools = [];
            for (let i = 0; i < NUM_OF.SCHOOL; i++) {
                const school = yield school_model_1.default.create({
                    name: faker_1.faker.internet.displayName(),
                    events: [events[0]],
                });
                schools.push(school);
            }
            return schools;
        });
    }
    function seedStudent() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = [];
            for (let i = 0; i < NUM_OF.USER; i++) {
                const user = yield student_model_1.default.create({
                    firstName: faker_1.faker.person.firstName(),
                    email: faker_1.faker.internet.email(),
                    lastName: faker_1.faker.person.lastName(),
                    address: faker_1.faker.location.streetAddress(),
                    schoolId: schools[1].id,
                    eventId: events[0].id,
                    phoneNumber: faker_1.faker.phone.number(),
                    level: "Junior",
                    scienceOrArt: "Science",
                    passport: faker_1.faker.image.avatar(),
                });
                users.push(user);
            }
            return users;
        });
    }
    function seedResult() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < NUM_OF.USER_RESULT; i++) {
                const results = yield result_model_1.default.create({
                    schoolId: schools[faker_1.faker.number.int({ max: 3 })].id,
                    mathematics: faker_1.faker.number.int({ max: 100 }),
                    position: faker_1.faker.number.int({ max: 100 }),
                    eventId: "",
                    writing: faker_1.faker.number.int({ max: 100 }),
                    studentRegNo: student[i].registrationNumber,
                    reading: faker_1.faker.number.int({ max: 100 }),
                    total: faker_1.faker.number.int({ max: 100 }),
                });
            }
        });
    }
    return res.status(error_controller_1.resCode.OK).json({
        ok: true,
        message: "Database has been seeded successfully",
    });
});
exports.default = seedDB;
//# sourceMappingURL=seed.js.map