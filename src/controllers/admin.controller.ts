import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import { resCode } from "./error.controller";
import { z } from "zod";
import { getStringValidation } from "../validation/reqSchemas";
import AppError from "./AppError";
import fs from "fs";
import xlsx from "xlsx";
import { findIndexContainingString, isValidBase64 } from "./helpers.controller";
import prisma from "./../../prisma/index";

// Example usage
export const createCompetion = async (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Create competition here",
	});
};

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

	const school = await prisma.school.findFirst({ where: { id } });

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

		// result = await prisma.school.update({where:{id},data:{results:{createMany}}})

		// prisma.studentResult.updateMany({where})

		// .bulkCreate(resultData);
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
			eventId: getStringValidation("eventId"),
		})
		.safeParse(req.params);

	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { schoolId, eventId } = safe.data;

	const results = await prisma.studentResult.findMany({
		where: { schoolId },
		include: { school: true, student: true },
	});

	if (!results || results.length < 1)
		throw new AppError("No results", resCode.NOT_FOUND);

	const schoolName = "MOUNTAIN CREST INTERNATIONAL SECONDARY SCHOOL";

	const arrTitle = [
		`${results[0].school.name.toLocaleUpperCase()} SAT TEST RESULT`,
	];

	const arrHeader = [
		"S/N",
		"NAME",
		"REG NUMBER",
		"READING",
		"WRITING",
		"MATH",
		"TOTAL",
		"POSITION",
	];

	const rows = results.map((item, i) => [
		i + 1,
		item.student.firstName.toLocaleUpperCase() +
			" " +
			item.student.lastName.toLocaleUpperCase(),
		item.studentRegNo,
		item.reading,
		item.writing,
		item.mathematics,
		item.total,
		item.position,
	]);

	const resultArrData = [
		arrTitle,
		arrHeader,
		...rows,
		[null, "MARKS OBTAINABLE", , null, null, null, null],
	];

	const sheetName: string = "sheet1";
	const fileName = results[0].school.name.replace(" ", "_") + "_results";
	const workbook = xlsx.utils.book_new();
	const worksheet = xlsx.utils.aoa_to_sheet(resultArrData);

	xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

	const excelBuffer = xlsx.write(workbook, {
		type: "buffer",
		bookType: "xlsx",
	});

	// Send the Excel file
	res.setHeader(
		"Content-Disposition",
		`attachment; filename=${fileName.toLocaleUpperCase()}.xlsx`
	);
	res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	return res.status(resCode.ACCEPTED).send(excelBuffer);
};
