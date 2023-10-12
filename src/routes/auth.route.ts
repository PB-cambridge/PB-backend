import { Router, Request, Response } from "express";

import { resCode, tryCatchWapper } from "../controllers/error.controller";
import { SuccessResponse } from "../types";
import {
	registerUser,
	sendOTP,
	userLogin,
} from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/login", tryCatchWapper(userLogin));

authRoute.post("/signup", tryCatchWapper(registerUser));

authRoute.post("/send-opt", tryCatchWapper(sendOTP));

export default authRoute;
