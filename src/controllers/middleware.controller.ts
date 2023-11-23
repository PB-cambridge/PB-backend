import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma";
import { resCode } from "./error.controller";
import AppError from "./AppError";
import { z } from "zod";
import env from "../../env";

export const isValidToken = (
	obj: unknown
): obj is { id: string } & jwt.JwtPayload =>
	obj !== null && typeof obj == "object" && "id" in obj;

export const hasExpired = (exp: number) => exp * 1000 < new Date().getTime();

export const protectedRoute = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const isValid = z.object({ authed: z.string() }).safeParse(req.cookies);

		if (!isValid.success)
			throw new AppError("Not logged in", resCode.UNAUTHORIZED);

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

		if (!admin) throw new AppError("Invalid auth cookie", resCode.UNAUTHORIZED);

		res.locals.user = admin;
		// console.log(admin.email);

		next();
	} catch (err) {
		next(err);
	}
};
