import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { SuccessResponse } from "../types";
import jwt from "jsonwebtoken";
import { resCode } from "./error.controller";
import AppError from "./AppError";
import {
	getNumberValidation,
	getStringValidation,
	loginReqSchema,
	registerStudentReqSchema,
} from "../validation/reqSchemas";
import env from "../../env";
import prisma from "../../prisma";
import { z } from "zod";
import { regNo } from "./helpers.controller";

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

export const verifyPaystackPayment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
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

		if (isNaN(+reference))
			throw new AppError("'reference' must be a number", resCode.NOT_ACCEPTED);

		// verify payment for the competition using paystack

		next();
	} catch (error) {
		next(error);
	}
};

export const registerUser = async (req: Request, res: Response) => {
	const safeParam = z
		.object({ competitionId: getStringValidation("competitionId") })
		.safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);
	const { competitionId } = safeParam.data;

	const safe = registerStudentReqSchema.safeParse(req.body);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);
	const { passport, schoolId, firstName, ...others } = safe.data;

	const competion = await prisma.competition.findFirst({
		where: { id: competitionId },
	});

	if (!competion)
		throw new AppError(
			"Competition with the provided id does not exist",
			resCode.NOT_FOUND
		);

	const selectedSchool = await prisma.school.findFirst({
		where: { id: schoolId },
	});

	if (!selectedSchool)
		throw new AppError("Selected school does not exist", resCode.NOT_FOUND);

	//  passport to file

	const registeredStudent = await prisma.student.create({
		data: {
			firstName,
			passport,
			competitionId: competitionId,
			schoolId,
			regNo: regNo(firstName),
			...others,
			result: { create: { schoolId, competitionId } },
		},
	});

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Registration Successful",
		data: { registeredStudent },
	});
};

export const sendOTP = async (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Otp send successfully.",
		data: {},
	});
};
