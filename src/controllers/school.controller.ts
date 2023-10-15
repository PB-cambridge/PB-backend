import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import School from "../models/school.model";
import { resCode } from "./error.controller";

export const getSchools = async (req: Request, res: Response) => {
	const schools = await School.findAll();

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "schools ",
		data: schools,
	});
};
