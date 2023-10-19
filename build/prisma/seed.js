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
const faker_1 = require("@faker-js/faker");
const error_controller_1 = require("../src/controllers/error.controller");
const index_1 = __importDefault(require("./index"));
const helpers_controller_1 = require("../src/controllers/helpers.controller");
const NUM_OF = {
    SCHOOL: 5,
    USER: 5,
    USER_RESULT: 2,
    EVENTS: 2,
};
function seedDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const events = yield seedEvent();
        const schools = yield seedSchool();
        const students = yield seedStudent();
        // await seedResult();
        function seedEvent() {
            return __awaiter(this, void 0, void 0, function* () {
                const events = [];
                for (let i = 0; i < NUM_OF.EVENTS; i++) {
                    const event = yield index_1.default.event.create({
                        data: {
                            title: faker_1.faker.internet.displayName(),
                            bannerImage: faker_1.faker.internet.avatar(),
                            dateTime: faker_1.faker.date.future(),
                            description: faker_1.faker.lorem.sentence(),
                            location: faker_1.faker.location.secondaryAddress(),
                            // registrationFee: +faker.commerce.price({ dec: 2 }),
                        },
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
                    const school = yield index_1.default.school.create({
                        data: {
                            name: faker_1.faker.internet.displayName(),
                        },
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
                    const user = yield index_1.default.student.create({
                        data: {
                            firstName: faker_1.faker.person.firstName(),
                            email: faker_1.faker.internet.email(),
                            lastName: faker_1.faker.person.lastName(),
                            address: faker_1.faker.location.streetAddress(),
                            school: { connect: { id: schools[0].id } },
                            regNo: (0, helpers_controller_1.regNo)(faker_1.faker.person.firstName()),
                            phoneNumber: faker_1.faker.phone.number(),
                            result: {
                                create: {
                                    school: { connect: { id: schools[0].id } },
                                },
                            },
                            level: "Junior",
                            scienceOrArt: "Science",
                            passport: faker_1.faker.image.avatar(),
                        },
                    });
                    users.push(user);
                }
                return users;
            });
        }
        function seedResult() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < NUM_OF.USER_RESULT; i++) {
                    const results = yield index_1.default.studentResult.create({
                        data: {
                            mathematics: faker_1.faker.number.int({ max: 100 }),
                            position: faker_1.faker.number.int({ max: 100 }),
                            writing: faker_1.faker.number.int({ max: 100 }),
                            reading: faker_1.faker.number.int({ max: 100 }),
                            student: { connect: { regNo: students[i].regNo } },
                            school: { connect: { id: schools[0].id } },
                            total: faker_1.faker.number.int({ max: 100 }),
                        },
                    });
                }
            });
        }
        console.log("Database has been seeded successfully");
    });
}
exports.default = seedDb;
const seedDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield seedDb();
    return res.status(error_controller_1.resCode.OK).json({
        ok: true,
        message: "Database has been seeded successfully",
    });
});
seedDb();
//# sourceMappingURL=seed.js.map