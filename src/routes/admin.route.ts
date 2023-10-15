import { Router, Request, Response } from "express";

import { resCode, tryCatchWapper } from "../controllers/error.controller";
import { SuccessResponse } from "../types";
import { uploadResultFile } from "../controllers/admin.controller";

const adminRoute = Router();

adminRoute.get("/", (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "this is the admin route",
		data: {},
	});
});

adminRoute.post("/upload-results", tryCatchWapper(uploadResultFile));

export default adminRoute;
