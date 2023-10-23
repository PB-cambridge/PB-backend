import { Router, Request, Response } from "express";

import { resCode, tryCatchWapper } from "../controllers/error.controller";
import { SuccessResponse } from "../types";
import {
	createCompetion,
	downloadResultTemp,
	getActiveCompetion,
	uploadResultFile,
} from "../controllers/admin.controller";

const adminRoute = Router();

adminRoute.get("/", (req: Request, res: Response) => {
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<any>>{
		ok: true,
		message: "this is the admin route",
		data: {},
	});
});
adminRoute.post("/create-competition", tryCatchWapper(createCompetion));

adminRoute.post("/update-results", tryCatchWapper(uploadResultFile));

adminRoute.get("/ongoing-competitions", tryCatchWapper(getActiveCompetion));

adminRoute.get(
	"/results-template/:schoolId/:competitionId",
	tryCatchWapper(downloadResultTemp)
);

export default adminRoute;
