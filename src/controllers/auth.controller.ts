import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { SuccessResponse } from "../types";
import jwt from "jsonwebtoken";
import { resCode } from "./error.controller";
import AppError from "./AppError";
import User from "../models/user.model";
import { loginReqSchema } from "../validation/reqSchemas";
import env from "../../env";

export const userLogin = async (req: Request, res: Response) => {
	const safe = loginReqSchema.safeParse(req.body);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { email, password } = safe.data;

	// authenticate here
	const user = await User.findOne({ where: { email } });

	// findFirst({
	// 	where: { email },
	// 	select: { id: true, username: true, email: true, password: true },
	// });

	if (!user) throw new AppError("Incorrect email", resCode.UNAUTHORIZED);

	const authorised = await bcrypt.compareSync(password, user.password);

	if (!authorised)
		throw new AppError("Incorrect password", resCode.UNAUTHORIZED);

	const token = jwt.sign(
		{ id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
		env.HASH_SECRET + ""
	);

	const { password: pass, ...userData } = user;

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "ready to handle login request",
		data: userData,
	});
};

export const registerUser = async (req: Request, res: Response) => {
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
