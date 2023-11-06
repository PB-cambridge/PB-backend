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
exports.handleDropTable = exports.handleSeedDB = void 0;
const faker_1 = require("@faker-js/faker");
const error_controller_1 = require("../src/controllers/error.controller");
const index_1 = __importDefault(require("./index"));
const helpers_controller_1 = require("../src/controllers/helpers.controller");
const NUM_OF = {
    SCHOOL: 5,
    USER: 100,
    USER_RESULT: 2,
    EVENTS: 5,
    ANNOUNCEMENT: 5,
    COMPETITION: 2,
};
function dropAllTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const tableNames = [
            "Admin",
            "Announcements",
            "Event",
            "School",
            "StudentResult",
            "Student",
            "Competition",
            "Payments",
        ];
        for (const tableName of tableNames)
            yield index_1.default.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
        console.log("Tables dropped");
    });
}
function seedDb() {
    return __awaiter(this, void 0, void 0, function* () {
        // const schools = await seedSchool();
        const competitions = yield seedCompetition();
        yield seedEvent();
        yield seedAnnouncements();
        const students = yield seedStudent();
        // await seedResult();
        // async function seedEvent() {}
        function seedAnnouncements() {
            return __awaiter(this, void 0, void 0, function* () {
                const events = [];
                for (let i = 0; i < NUM_OF.ANNOUNCEMENT; i++) {
                    const event = yield index_1.default.announcements.create({
                        data: {
                            content: faker_1.faker.lorem.sentences(),
                            date: faker_1.faker.date.recent(),
                        },
                    });
                    events.push(event);
                }
                return events;
            });
        }
        function seedCompetition() {
            return __awaiter(this, void 0, void 0, function* () {
                const competitions = [];
                for (let i = 0; i < NUM_OF.COMPETITION; i++) {
                    const competition = yield index_1.default.competition.create({
                        data: {
                            name: faker_1.faker.internet.displayName(),
                            startDate: faker_1.faker.date.future(),
                            endDate: faker_1.faker.date.future(),
                            juniorRegFee: +faker_1.faker.commerce.price(),
                            seniorRegFee: +faker_1.faker.commerce.price(),
                            graduateRegFee: +faker_1.faker.commerce.price(),
                            schools: {
                                create: [1, 2].map(() => ({ name: faker_1.faker.internet.displayName() })),
                            },
                        },
                        include: { schools: true },
                    });
                    competitions.push(competition);
                }
                return competitions;
            });
        }
        function seedEvent() {
            return __awaiter(this, void 0, void 0, function* () {
                const events = [];
                for (let i = 0; i < NUM_OF.EVENTS; i++) {
                    const event = yield index_1.default.event.create({
                        data: {
                            title: faker_1.faker.internet.displayName(),
                            bannerImage: faker_1.faker.internet.avatar(),
                            startTime: faker_1.faker.date.future(),
                            endTime: faker_1.faker.date.future(),
                            description: faker_1.faker.lorem.sentence(),
                            location: faker_1.faker.location.secondaryAddress(),
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
                        include: { competition: true },
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
                    const randomComp = competitions[Math.floor(Math.random() * competitions.length)];
                    const randomSchoool = randomComp.schools[Math.random() < 0.5 ? 0 : 1];
                    const user = yield index_1.default.student.create({
                        data: {
                            firstName: faker_1.faker.person.firstName(),
                            email: faker_1.faker.internet.email(),
                            lastName: faker_1.faker.person.lastName(),
                            address: faker_1.faker.location.streetAddress(),
                            school: { connect: { id: randomSchoool.id } },
                            regNo: (0, helpers_controller_1.regNo)(faker_1.faker.person.firstName()),
                            phoneNumber: faker_1.faker.phone.number(),
                            hasInternationalPassport: Math.random() < 0.5,
                            competition: { connect: { id: randomComp.id } },
                            result: {
                                create: {
                                    school: { connect: { id: randomSchoool.id } },
                                    competition: { connect: { id: randomComp.id } },
                                },
                            },
                            level: ["Junior", "Senior", "Graduated"][Math.floor(Math.random() * 3)],
                            scienceOrArt: Math.random() > 0.5 ? "Science" : "Art",
                            passport: faker_1.faker.image.avatar(),
                        },
                    });
                    users.push(user);
                }
                return users;
            });
        }
        // async function seedResult() {
        // 	for (let i = 0; i < NUM_OF.USER_RESULT; i++) {
        // 		const results = await prisma.studentResult.create({
        // 			data: {
        // 				mathematics: faker.number.int({ max: 100 }),
        // 				position: faker.string.fromCharacters(["1st", "2nd", "3rd", "4th"]),
        // 				writing: faker.number.int({ max: 100 }),
        // 				reading: faker.number.int({ max: 100 }),
        // 				student: { connect: { regNo: students[i].regNo } },
        // 				school: { connect: { id: schools[0].id } },
        // 				total: faker.number.int({ max: 100 }),
        // 				competition: { connect: { id: competitions[1].id } },
        // 			},
        // 		});
        // 	}
        // }
        console.log("Database has been seeded successfully");
    });
}
exports.default = seedDb;
const handleSeedDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("seeding");
    yield seedDb();
    return res.status(error_controller_1.resCode.OK).json({
        ok: true,
        message: "Database has been seeded successfully",
    });
});
exports.handleSeedDB = handleSeedDB;
const handleDropTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dropping");
    yield dropAllTable();
    return res.status(error_controller_1.resCode.OK).json({
        ok: true,
        message: "Database tables dropped successfully",
    });
});
exports.handleDropTable = handleDropTable;
// seedDb();
// dropAllTable();
//# sourceMappingURL=seed.js.map