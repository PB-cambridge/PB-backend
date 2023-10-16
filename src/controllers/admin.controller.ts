import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import { resCode } from "./error.controller";
import { z } from "zod";
import { getStringValidation } from "../validation/reqSchemas";
import AppError from "./AppError";
import fs from "fs";
import xlsx from "xlsx";
import StudentResult from "../models/result.model";
import School from "../models/school.model";
import Student from "../models/student.model";

export function findIndexContainingString(arr: any[], searchString: string) {
	return arr.findIndex(function (item) {
		return item.includes(searchString);
	});
}

export function isValidBase64(str: string) {
	const base64Regex = /^[A-Za-z0-9+/=]+$/;
	return base64Regex.test(str);
}

// Example usage
export const uploadResultFile = async (req: Request, res: Response) => {
	const safe = z
		.object({
			schoolId: getStringValidation("schoolId"),
			year: getStringValidation("year"),
			resultFileString: getStringValidation("resultFileString").refine(
				(value) => isValidBase64(value),
				{
					message: "Invalid Base64 string",
				}
			),
		})
		.safeParse(req.body);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { schoolId: id, year, resultFileString } = safe.data;

	// check if schoool exists

	const school = await School.findOne({ where: { id } });

	if (!school) throw new AppError("School not found", resCode.NOT_FOUND);

	// result upload logic here
	let result;
	try {
		const excelData = Buffer.from(resultFileString, "base64");

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
				schoolId: school.id,
				year,
			});
		}

		result = await StudentResult.bulkCreate(resultData);
	} catch (error) {
		throw new AppError(
			"Something wnet wrong with resullt upload",
			resCode.INTERNAL_SERVER_ERROR,
			error
		);
	}

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Result uploaded successful",
		data: result,
	});
};

export const downloadResultTemp = async (req: Request, res: Response) => {
	const safe = z
		.object({
			schoolId: getStringValidation("schoolId"),
			year: getStringValidation("year"),
		})
		.safeParse(req.params);

	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { schoolId: id, year } = safe.data;

	const school = await School.findOne({
		where: { id },
		include: [Student, StudentResult],
	});

	if (!school) throw new AppError("School not found", resCode.NOT_FOUND);

	const students = school.students;

	if (students.length < 1)
		throw new AppError("School has no student", resCode.NOT_FOUND, students);

	return res.status(resCode.ACCEPTED).send(students);

	const schoolName = "MOUNTAIN CREST INTERNATIONAL SECONDARY SCHOOL";
	const resultArrData = [
		[`${schoolName} SAT TEST RESULT`],
		[
			"S/N",
			"NAME",
			"REG NUMBER",
			"READING",
			"WRITING",
			"MATH",
			"TOTAL",
			"POSITION",
		],
		[5, "AHAM-NWOGU CHUKWUANUGO", `regNo`, null, null, null, null, ""],
		[14, "EMEH KOSISOCHUKWU", `regNo`, null, null, null, null, ""],
		[3, "AHAM-NWOGU KANYITOCHUKWU", `regNo`, null, null, null, null, ""],
		[8, "CHIGBO CHIDOZIE ANADEBE", `regNo`, null, null, null, null, ""],
		[15, "EBUBE CHIJIOKE OKERE", `regNo`, null, null, null, null, ""],
		[18, "NWUGO STEPHANIE", `regNo`, null, null, null, null, ""],
		[6, "CHUKWUEMEKA JOHN-OKAFOR", `regNo`, null, null, null, null, ""],
		[10, "CHIEKEZI FAVOUR IHEOUA", `regNo`, null, null, null, null, ""],
		[1, "AZIKE CLINTON", `regNo`, null, null, null, null, ""],
		[13, "DON-DANIEL UCHENNA", `regNo`, null, null, null, null, ""],
		[4, "AGWASIEM-OBASI CHIDUBEM", `regNo`, null, null, null, null, ""],
		[22, "OTUSOROCHUKWU EMMANUEL", `regNo`, null, null, null, null, ""],
		[17, "NNABUE CHIMAOBI", `regNo`, null, null, null, null, ""],
		[24, "UCHENNA PRECIOUS", `regNo`, null, null, null, null, ""],
		[9, "CHUKWUKA DIVINE-FAVOUR", `regNo`, null, null, null, null, ""],
		[21, "OKPO KAMSI DERRICK ", `regNo`, null, null, null, null, ""],
		[23, "THEODORE DIVINE-PROSPER", `regNo`, null, null, null, null, ""],
		[19, "NWOKORO GABRIEL PRIASE", `regNo`, null, null, null, null, ""],
		[7, "CHIDI IKECHUKWU", `regNo`, null, null, null, null, ""],
		[12, "KINGCHI DEVOP", `regNo`, null, null, null, null, ""],
		[11, "CHRISTABEL ANYIAM", `regNo`, null, null, null, null, ""],
		[2, "AZIKE FAVOUR", `regNo`, null, null, null, null, ""],
		[16, "IWUANYANWU JESSICA", `regNo`, null, null, null, null, ""],
		[20, "ONYEAMA SOMTOCHUKWU", `regNo`, null, null, null, null, ""],
		[null, "MARKS OBTAINABLE", , null, null, null, null],
	];

	const sheetName: string = "sheet1";
	const fileName = "schoolName_result_template";
	const workbook = xlsx.utils.book_new();
	const worksheet = xlsx.utils.aoa_to_sheet(resultArrData);

	xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

	const excelBuffer = xlsx.write(workbook, {
		type: "buffer",
		bookType: "xlsx",
	});

	// Send the Excel file
	res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
	res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	return res.status(resCode.ACCEPTED).send(excelBuffer);
};
