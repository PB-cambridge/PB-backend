import School from "./school.model";
import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Student from "./student.model";
import StudentResult from "./result.model";
import { resCode } from "../controllers/error.controller";
import { SuccessResponse } from "../types";

const NUM_OF = {
	SCHOOL: 5,
	USER: 5,
	USER_RESULT: 2,
} as const;

const seedDB = async (req: Request, res: Response) => {
	const schools = await seedSchool();
	const student = await seedStudent();
	// await seedResult();

	async function seedSchool() {
		const schools = [];
		for (let i = 0; i < NUM_OF.SCHOOL; i++) {
			const school = await School.create({
				name: faker.internet.displayName(),
			});
			schools.push(school);
		}
		return schools;
	}
	async function seedStudent() {
		const users = [];
		for (let i = 0; i < NUM_OF.USER; i++) {
			const user = await Student.create({
				firstName: faker.person.firstName(),
				email: faker.internet.email(),
				lastName: faker.person.lastName(),
				address: faker.location.streetAddress(),
				schoolId: schools[1].id,
				// school: schools[1],
				phoneNumber: faker.phone.number(),
				level: "Junior",
				scienceOrArt: "Science",
				passport: faker.image.avatar(),
			});
			users.push(user);
		}
		return users;
	}

	async function seedResult() {
		for (let i = 0; i < NUM_OF.USER_RESULT; i++) {
			const results = await StudentResult.create({
				schoolId: schools[faker.number.int({ max: 3 })].id,
				year: "2022",
				mathematics: faker.number.int({ max: 100 }),
				position: faker.number.int({ max: 100 }),
				writing: faker.number.int({ max: 100 }),
				studentRegNo: student[i].registrationNumber,
				reading: faker.number.int({ max: 100 }),
				total: faker.number.int({ max: 100 }),
			});
		}
	}

	return res.status(resCode.OK).json(<SuccessResponse<any>>{
		ok: true,
		message: "Database has been seeded successfully",
	});
};

export default seedDB;
