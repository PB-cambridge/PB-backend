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
import {
	generateAcknowledgementSlip,
	regNo,
	uploadImage,
} from "./helpers.controller";
import Paystack from "paystack";
import { UploadApiResponse } from "cloudinary";
import { sendEmail } from "./mail.controller";
import { hasExpired, isValidToken } from "./middleware.controller";

const paystack = Paystack(env.PAYSTACK_SECRET_KEY);

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

	res.cookie("authed", token, {
		httpOnly: true,
		maxAge: 5 * 24 * 60 * 60 * 1000,
		sameSite: "none",
		secure: true,
	});

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Login successfull",
		data: adminData,
		// token,
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

		// verify payment for the competition using paystack
		const response = await paystack.transaction.verify("" + reference);
		if (!response.status)
			throw new AppError(response.message, resCode.NOT_ACCEPTED, response);

		res.locals.paymentDetails = response.data;

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
	const {
		passport: _passport,
		schoolId,
		firstName,
		email,
		...others
	} = safe.data;

	const uploadImageRes = await uploadImage(_passport);
	if (uploadImageRes.error)
		throw new AppError(
			"An error Occoured",
			resCode.BAD_GATEWAY,
			uploadImageRes.error
		);

	const passport = (uploadImageRes as UploadApiResponse).url;

	const paymentDetails = res.locals.paymentDetails;

	const paidAmt = (paymentDetails.amount / 100) as number;

	const competion = await prisma.competition.findFirst({
		where: { id: competitionId },
		include: { schools: true },
	});

	if (!competion)
		throw new AppError(
			"Competition with the provided id does not exist",
			resCode.NOT_FOUND
		);

	const requiredFee =
		others.level == "Senior"
			? competion.seniorRegFee
			: others.level == "Junior"
			? competion.juniorRegFee
			: competion.graduateRegFee;

	if (paidAmt < requiredFee)
		throw new AppError(
			`The required amount for ${others.level} is #${requiredFee}`,
			resCode.NOT_ACCEPTED
		);

	const selectedSchool = competion.schools.find(
		(item, i) => item.id == schoolId
	);

	if (!selectedSchool)
		throw new AppError(
			"This competion is not hosted for your school",
			resCode.NOT_FOUND
		);

	//  passport to file

	const registeredStudent = await prisma.student.create({
		data: {
			firstName,
			passport,
			email,
			competitionId: competitionId,
			schoolId,
			regNo: regNo(firstName),
			...others,
			result: { create: { schoolId, competitionId } },
		},
		include: {
			school: true,
			competition: {
				select: { id: true, endDate: true, startDate: true, name: true },
			},
		},
	});

	// Add to payment
	const addedPay = await prisma.payments.create({
		data: {
			amount: paidAmt,
			competitionId,
			paystackRef: paymentDetails.reference,
			studentData: JSON.stringify(registeredStudent),
		},
	});

	// send acknowledgement email
	const acknowledgementMail = generateAcknowledgementSlip({
		...registeredStudent,
		competionFee: requiredFee,
		paidAmount: paidAmt,
		reference: paymentDetails.reference,
	});
	try {
		sendEmail(email, acknowledgementMail, "PAYMENT ACKNOWLEDGEMENT");
	} catch (error) {
		console.log(error);
	}

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Registration Successful",
		data: {
			...registeredStudent,
			competionFee: requiredFee,
			paidAmount: paidAmt,
			reference: paymentDetails.reference,
		},
	});
};

export const changePassword = async (req: Request, res: Response) => {
	const safe = z
		.object({
			oldpassword: getStringValidation("oldpassword"),
			password: getStringValidation("password"),
		})
		.safeParse(req.body);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { password: rawPassword, oldpassword } = safe.data;

	// return console.log(res.locals);

	const email = res.locals?.user?.email as string;
	const oldpasswordHash = res.locals?.user?.password as string;
	if (!email || !oldpasswordHash)
		throw new AppError("Not logged in", resCode.UNAUTHORIZED);

	// verify old password
	const verified = bcrypt.compareSync(oldpassword, oldpasswordHash);

	if (!verified)
		throw new AppError("Incorrect old password", resCode.NOT_ACCEPTED);

	// now change password
	const salt = bcrypt.genSaltSync(10);
	const password = await bcrypt.hashSync(rawPassword, salt);

	const updatedPassword = await prisma.admin.update({
		where: { email },
		data: { password },
	});

	if (!updatedPassword)
		throw new AppError(
			"Password changed failed",
			resCode.INTERNAL_SERVER_ERROR
		);

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Password changed",
	});
};

export const sendOTP = async (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Otp send successfully.",
		data: {},
	});
};

export const AdminLogout = async (req: Request, res: Response) => {
	return res
		.cookie("authed", "token", {
			httpOnly: true,
			maxAge: 5,
		})
		.status(resCode.ACCEPTED)
		.json(<SuccessResponse<any>>{
			ok: true,
			message: "Logged out",
			data: {},
		});
};

export const checkAuth = async (req: Request, res: Response) => {
	const isValid = z.object({ authed: z.string() }).safeParse(req.cookies);

	if (!isValid.success)
		throw new AppError("Not authenticated", resCode.UNAUTHORIZED);

	// const providedToken = isValid.data.authed.split(" ")?.[1]?.trim();
	const providedToken = isValid.data.authed;

	if (!providedToken)
		throw new AppError("Invalid API key", resCode.UNAUTHORIZED);

	const veriedToken: unknown = jwt.verify(providedToken, env.HASH_SECRET);

	if (!isValidToken(veriedToken))
		throw new AppError("Invalid API key", resCode.UNAUTHORIZED);

	const { id, exp } = veriedToken;

	if (exp && hasExpired(exp))
		throw new AppError("API key has expired", resCode.UNAUTHORIZED);

	const admin = await prisma.admin.findFirst({ where: { id } });

	if (!admin) throw new AppError("Not an admin", resCode.UNAUTHORIZED);

	res.locals.user = admin;
	// console.log(admin.email);

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "Authenticated",
	});
};

const obj = {
	title: "3 ore more",
	description: "3 ore more",
	location: "Aba",
	bannerImage: "Aba",
	organisedBy: "Precious",
	type: "Seminar",
	startTime: "12/12/23",
	endTime: "12/13/23",
};
