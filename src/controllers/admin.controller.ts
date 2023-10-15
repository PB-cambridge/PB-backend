import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import { resCode } from "./error.controller";
import { z } from "zod";
import { getStringValidation } from "../validation/reqSchemas";
import AppError from "./AppError";
import fs from "fs";
import xlsx from "xlsx";
import UserResult from "../models/result.model";
import School from "../models/school.model";

export function findIndexContainingString(arr: any[], searchString: string) {
	return arr.findIndex(function (item) {
		return item.includes(searchString);
	});
}

function isValidBase64(str: string) {
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

		result = await UserResult.bulkCreate(resultData);
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
