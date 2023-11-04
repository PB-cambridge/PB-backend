import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import { resCode } from "./error.controller";
import { z } from "zod";
import AppError from "./AppError";
import { getStringValidation } from "../validation/reqSchemas";
import prisma from "../../prisma";
import { generateAcknowledgementSlip } from "./helpers.controller";

export const viewResult = async (req: Request, res: Response) => {
	const safeParam = z
		.object({ regNo: getStringValidation("regNo") })
		.safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);
	const { regNo } = safeParam.data;

	const student = await prisma.student.findUnique({
		where: { regNo },
		include: {  result: true, school: true, competition: true },
	});
	// console.log(student);

	if (!student) throw new AppError("Incorrect regNo", resCode.NOT_FOUND);

	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: `Check your result here with this your reg no ${req.params.regNo}`,
		data: { student },
	});
};

export const reprintAcknowledgementSlip = async (
	req: Request,
	res: Response
) => {
	const safeParam = z
		.object({ reference: getStringValidation("reference") })
		.safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);
	const { reference } = safeParam.data;

	const paymentDetails = await prisma.payments.findFirst({
		where: { paystackRef: reference },
	});

	if (!paymentDetails)
		throw new AppError("Invalid reference", resCode.NOT_FOUND);

	const paymentDetails_studentData = JSON.parse(paymentDetails.studentData);

	const acknowledgementDetails = {
		...paymentDetails_studentData,
		paidAmount: paymentDetails.amount,
		reference: paymentDetails.paystackRef,
	};

	// return res.send(generateAcknowledgementSlip(acknowledgementDetails));
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: `Reprint your Ack SLip here`,
		data: acknowledgementDetails,
	});
};
