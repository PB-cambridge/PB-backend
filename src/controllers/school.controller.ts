import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import { resCode } from "./error.controller";
import prisma from "../../prisma";
import { z } from "zod";
import { getStringValidation } from "../validation/reqSchemas";
import AppError from "./AppError";

export const getAllSchools = async (req: Request, res: Response) => {
	const data = await prisma.school.findMany({
		select: { _count: { select: { students: true } }, id: true, name: true },
	});

	const schools = data.map(({ _count: { students }, ...__ }) => ({
		students,
		...__,
	}));

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "schools",
		data: { schools },
	});
};
export const createSchool = async (req: Request, res: Response) => {
	const safeInput = z
		.object({
			name: getStringValidation("name"),
		})
		.safeParse(req.body);

	if (!safeInput.success)
		throw new AppError(
			safeInput.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeInput.error
		);

	const { name } = safeInput.data;

	const data = await prisma.school.create({ data: { name } });

	return res.status(resCode.CREATED).json(<SuccessResponse<any>>{
		ok: true,
		message: "School created",
		data,
	});
};
export const updateSchool = async (req: Request, res: Response) => {
	const safeInput = z
		.object({
			name: getStringValidation("name"),
		})
		.safeParse(req.body);
	const id = req.params.id;

	if (!id) throw new AppError("Provide an id", resCode.BAD_REQUEST);

	if (!safeInput.success)
		throw new AppError(
			safeInput.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeInput.error
		);

	const { name } = safeInput.data;

	const data = await prisma.school.update({ data: { name }, where: { id } });

	return res.status(resCode.CREATED).json(<SuccessResponse<any>>{
		ok: true,
		message: "School Updated",
		data,
	});
};
export const deleteSchool = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) throw new AppError("Provide an id", resCode.BAD_REQUEST);

	const data = await prisma.school.delete({ where: { id } });

	return res.status(resCode.CREATED).json(<SuccessResponse<any>>{
		ok: true,
		message: "School deleted",
		data,
	});
};
