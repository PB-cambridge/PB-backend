import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { SuccessResponse } from "../types";
import jwt from "jsonwebtoken";
import { resCode } from "./error.controller";
import AppError from "./AppError";
import {
	getStringValidation,
	loginReqSchema,
	registerStudentReqSchema,
} from "../validation/reqSchemas";
import env from "../../env";
import prisma from "../../prisma";
import { z } from "zod";

export const adminLogin = async (req: Request, res: Response) => {
	const safe = loginReqSchema.safeParse(req.body);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { email, password } = safe.data;

	// authenticate here
	const admin = await prisma.admin.findFirst({ where: { email } });

	if (!admin) throw new AppError("Incorrect email", resCode.UNAUTHORIZED);

	const authorised = bcrypt.compareSync(password, admin.password);

	if (!authorised)
		throw new AppError("Incorrect password", resCode.UNAUTHORIZED);

	const token = jwt.sign(
		{ id: admin.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
		env.HASH_SECRET + ""
	);

	const { password: pass, ...adminData } = admin;

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Login successfull",
		data: adminData,
		token,
	});
};

export const registerUser = async (req: Request, res: Response) => {
	// move this to be handled by a middleware
	const safeQuery = z
		.object({ reference: getStringValidation("reference") })
		.safeParse(req.query);
	if (!safeQuery.success)
		throw new AppError(
			safeQuery.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeQuery.error
		);
	const { reference } = safeQuery.data;
	// verify payment for the competition using paystack

	const safe = registerStudentReqSchema.safeParse(req.body);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { passport, schoolId, ...others } = safe.data;

	const selectedSchool = prisma.school.findFirst({ where: { id: schoolId } });

	if (!selectedSchool)
		throw new AppError("Selected school does not exist", resCode.NOT_FOUND);

	// create the student here

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "ready to register users",
		data: {},
	});
};

export const sendOTP = async (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Otp send successfully.",
		data: {},
	});
};
