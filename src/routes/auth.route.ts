import { Router, Request, Response } from "express";

import { resCode, tryCatchWapper } from "../controllers/error.controller";
import { SuccessResponse } from "../types";
import {
	registerUser,
	sendOTP,
	adminLogin,
	verifyPaystackPayment,
	checkAuth,
	AdminLogout,
} from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/admin-login", tryCatchWapper(adminLogin));

authRoute.post(
	"/register/:competitionId",
	verifyPaystackPayment,
	tryCatchWapper(registerUser)
);

authRoute.post("/send-opt", tryCatchWapper(sendOTP));

authRoute.get("/check-auth", tryCatchWapper(checkAuth));

authRoute.get("/logout", tryCatchWapper(AdminLogout));

export default authRoute;
