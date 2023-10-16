import fs from "fs";
import xlsx from "xlsx";
import { Sequelize } from "sequelize-typescript";
import env from "../../env";
import Student, { generateRegistrationNumber } from "./student.model";
import Admin from "./admin.model";
import Event from "./event.model";
import Announcement from "./announcement.model";
import StudentResult from "./result.model";
import School from "./school.model";
import { findIndexContainingString } from "../controllers/admin.controller";
import { resultFile } from "../routes/user.route";

export const sequelize = new Sequelize({
	database: "PBC_db",
	dialect: "sqlite",
	// username: "root",
	// password: "",
	storage: env.DATABASE_URL,
	models: [__dirname + "./"],
});

sequelize.addModels([
	Student,
	Admin,
	Event,
	Announcement,
	StudentResult,
	School,
]);

Student.beforeCreate(({ registrationNumber }) => {
	registrationNumber = generateRegistrationNumber();
});

Student.afterCreate(({ registrationNumber, schoolId }) => {
	StudentResult.create({
		studentRegNo: registrationNumber,
		schoolId,
		year: "2023",
	});
});

sequelize
	.sync({
		logging: false,
		force: true,
		// alter: true,
	})
	.then(() => {
		const { email, password } = {
			email: "teatadmin@gmail.com",
			password: "$2b$10$NN5LxOgYnjnNEu3u6adxfOafHYrxa50VpxWqtNrOz4h9HLwxM.URS",
		};
		Admin.create({ email, password }).then((_) => console.log("created"));
	});

async () => {
	const excelData = Buffer.from(resultFile, "base64");

	// Write the Excel data to a temporary file
	const tempFilePath = "temp.xlsx";
	fs.writeFileSync(tempFilePath, excelData);

	// Parse the Excel file
	const workbook = xlsx.readFile(tempFilePath);
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];

	// Convert the worksheet to JSON
	const jsonData: string[][] = xlsx.utils.sheet_to_json(worksheet, {
		header: 1,
	});

	// Delete the temporary file
	fs.unlinkSync(tempFilePath);

	jsonData[1] = jsonData[1].map((d) => d.replace(/[^a-zA-Z]/g, ""));

	const resultData: any[] = [];

	const indexTotal =
		findIndexContainingString(jsonData, "MARKS OBTAINABLE") || 0;

	for (let i = 2; i < indexTotal; i++) {
		resultData.push({
			studentName: jsonData[i][1],
			reading: jsonData[i][2],
			writing: jsonData[i][3],
			mathematics: jsonData[i][4],
			total: jsonData[i][5],
			position: jsonData[i][6],
			schoolName: jsonData[0][0],
			// schoolId: school.id,
			year: "2023",
		});
	}

	// result = await UserResult.bulkCreate(resultData);
	console.log(jsonData);
};
