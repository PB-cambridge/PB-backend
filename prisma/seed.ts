import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { resCode } from "../src/controllers/error.controller";
import { SuccessResponse } from "../src/types";
import prisma from "./index";
import { regNo } from "../src/controllers/helpers.controller";

const NUM_OF = {
	SCHOOL: 5,
	USER: 5,
	USER_RESULT: 2,
	EVENTS: 2,
	COMPETITION: 2,
} as const;

export default async function seedDb() {
	const schools = await seedSchool();
	const competitions = await seedCompetition();
	// const events = await seedEvent();
	const students = await seedStudent();

	// await seedResult();

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
						connect: [
							{ id: schools[0].id },
							{ id: schools[1].id },
							{ id: schools[3].id },
						],
					},
				},
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
			});
			schools.push(school);
		}
		return schools;
	}

	async function seedStudent() {
		const users = [];
		for (let i = 0; i < NUM_OF.USER; i++) {
			const user = await prisma.student.create({
				data: {
					firstName: faker.person.firstName(),
					email: faker.internet.email(),
					lastName: faker.person.lastName(),
					address: faker.location.streetAddress(),
					school: { connect: { id: schools[0].id } },
					regNo: regNo(faker.person.firstName()),
					phoneNumber: faker.phone.number(),
					hasInternationalPassport: false,
					competition: { connect: { id: competitions[1].id } },
					result: {
						create: {
							school: { connect: { id: schools[0].id } },
							competition: { connect: { id: competitions[1].id } },
						},
					},
					level: "Junior",
					scienceOrArt: "Science",
					passport: faker.image.avatar(),
				},
			});
			users.push(user);
		}
		return users;
	}

	async function seedResult() {
		for (let i = 0; i < NUM_OF.USER_RESULT; i++) {
			const results = await prisma.studentResult.create({
				data: {
					mathematics: faker.number.int({ max: 100 }),
					position: faker.string.fromCharacters(["1st", "2nd", "3rd", "4th"]),
					writing: faker.number.int({ max: 100 }),
					reading: faker.number.int({ max: 100 }),
					student: { connect: { regNo: students[i].regNo } },
					school: { connect: { id: schools[0].id } },
					total: faker.number.int({ max: 100 }),
					competition: { connect: { id: competitions[1].id } },
				},
			});
		}
	}

	console.log("Database has been seeded successfully");
}

const seedDB = async (req: Request, res: Response) => {
	await seedDb();
	return res.status(resCode.OK).json(<SuccessResponse<any>>{
		ok: true,
		message: "Database has been seeded successfully",
	});
};

seedDb();
