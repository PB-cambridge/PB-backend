import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import { resCode } from "./error.controller";
import prisma from "../../prisma";

export const getSchools = async (req: Request, res: Response) => {
	const schools = await prisma.school.findMany();

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "schools ",
		data: schools,
	});
};
