import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { resCode } from "../src/controllers/error.controller";
import { SuccessResponse } from "../src/types";
import prisma from "./index";
import { regNo } from "../src/controllers/helpers.controller";

const NUM_OF = {
	SCHOOL: 5,
	USER: 100,
	USER_RESULT: 2,
	EVENTS: 5,
	ANNOUNCEMENT: 5,
	COMPETITION: 2,
} as const;

async function dropAllTable() {
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
		await prisma.$queryRawUnsafe(
			`Truncate "${tableName}" restart identity cascade;`
		);

	console.log("Tables dropped");
}

export default async function seedDb() {
	// const schools = await seedSchool();
	await seedAdmin();
	const competitions = await seedCompetition();
	await seedEvent();
	await seedAnnouncements();
	const students = await seedStudent();

	// await seedResult();

	async function seedAdmin() {
		await prisma.admin.create({
			data: {
				email: "ceo@admail.com",
				password:
					"$2b$10$l3oznciq4HwbPHtHuXrbNuR5gNgz01If.nJJxzmomNw1zYZ.xsytC",
				photo: faker.internet.avatar(),
			},
		});
	}

	async function seedAnnouncements() {
		const events = [];
		for (let i = 0; i < NUM_OF.ANNOUNCEMENT; i++) {
			const event = await prisma.announcements.create({
				data: {
					content: faker.lorem.sentences(),
					date: faker.date.recent(),
				},
			});
			events.push(event);
		}
		return events;
	}

	async function seedCompetition() {
		const competitions = [];
		for (let i = 0; i < NUM_OF.COMPETITION; i++) {
			const competition = await prisma.competition.create({
				data: {
					name: faker.internet.displayName(),
					startDate: faker.date.future(),
					endDate: faker.date.future(),
					juniorRegFee: +faker.commerce.price(),
					seniorRegFee: +faker.commerce.price(),
					graduateRegFee: +faker.commerce.price(),
					schools: {
						create: [1, 2].map(() => ({ name: faker.internet.displayName() })),
					},
				},
				include: { schools: true },
			});
			competitions.push(competition);
		}
		return competitions;
	}

	async function seedEvent() {
		const events = [];
		for (let i = 0; i < NUM_OF.EVENTS; i++) {
			const event = await prisma.event.create({
				data: {
					title: faker.internet.displayName(),
					bannerImage: faker.internet.avatar(),

					startTime: faker.date.future(),
					endTime: faker.date.future(),
					description: faker.lorem.sentence(),
					location: faker.location.secondaryAddress(),
					type: ["Seminar", "Examination", "Result", "Tutorials"][
						Math.floor(Math.random() * 4)
					],
					organisedBy: [
						"Pbcambrige",
						"School of arts",
						"UNN school",
						"Precious",
					][Math.floor(Math.random() * 4)],
				},
			});
			events.push(event);
		}
		return events;
	}

	async function seedSchool() {
		const schools = [];
		for (let i = 0; i < NUM_OF.SCHOOL; i++) {
			const school = await prisma.school.create({
				data: {
					name: faker.internet.displayName(),
				},
				include: { competition: true },
			});
			schools.push(school);
		}
		return schools;
	}

	async function seedStudent() {
		const users = [];
		for (let i = 0; i < NUM_OF.USER; i++) {
			const randomComp =
				competitions[Math.floor(Math.random() * competitions.length)];

			const randomSchoool = randomComp.schools[Math.random() < 0.5 ? 0 : 1];

			const user = await prisma.student.create({
				data: {
					firstName: faker.person.firstName(),
					email: faker.internet.email({
						provider: "gmail.com",
						firstName: faker.person.firstName(),
						lastName: faker.person.lastName(),
					}),
					lastName: faker.person.lastName(),
					address: faker.location.streetAddress(),
					school: { connect: { id: randomSchoool.id } },
					regNo: regNo(faker.person.firstName()),
					phoneNumber: faker.phone.number(),
					hasInternationalPassport: Math.random() < 0.5,
					competition: { connect: { id: randomComp.id } },
					result: {
						create: {
							school: { connect: { id: randomSchoool.id } },
							competition: { connect: { id: randomComp.id } },
						},
					},
					level: ["Junior", "Senior", "Graduated"][
						Math.floor(Math.random() * 3)
					],
					scienceOrArt: Math.random() > 0.5 ? "Science" : "Art",
					passport: faker.image.avatar(),
				},
			});
			users.push(user);
		}
		return users;
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
}

export const handleSeedDB = async (req: Request, res: Response) => {
	console.log("seeding");

	await seedDb();
	return res.status(resCode.OK).json(<SuccessResponse<any>>{
		ok: true,
		message: "Database has been seeded successfully",
	});
};

export const handleDropTable = async (req: Request, res: Response) => {
	console.log("dropping");
	await dropAllTable();
	return res.status(resCode.OK).json(<SuccessResponse<any>>{
		ok: true,
		message: "Database tables dropped successfully",
	});
};

// seedDb();
// dropAllTable();
