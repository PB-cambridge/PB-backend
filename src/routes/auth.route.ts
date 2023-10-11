import { Router, Request, Response } from "express";

import { resCode, tryCatchWapper } from "../controllers/error.controller";
import { SuccessResponse } from "../types";

const authRoute = Router();

authRoute.post("/login", (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "ready to handle login request",
		data: {},
	});
});
authRoute.post("/signup", (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "ready to register users",
		data: {},
	});
});

export default authRoute;
