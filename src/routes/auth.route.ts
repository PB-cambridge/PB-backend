import { Router, Request, Response } from "express";

import { resCode, tryCatchWapper } from "../controllers/error.controller";
import { SuccessResponse } from "../types";
import {
	registerUser,
	sendOTP,
	adminLogin,
	verifyPaystackPayment,
} from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/admin-login", tryCatchWapper(adminLogin));

authRoute.post(
	"/register/:competitionId",
	verifyPaystackPayment,
	tryCatchWapper(registerUser)
);

authRoute.post("/send-opt", tryCatchWapper(sendOTP));

export default authRoute;
