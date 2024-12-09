import { Router, Request, Response } from "express";

import { resCode, tryCatchWapper } from "../controllers/error.controller";
import { SuccessResponse } from "../types";
import {
	adminStats,
	createAnnouncement,
	createCompetion,
	createEvent,
	downloadResultTemp,
	getActiveCompetion,
	getAllCompetions,
	getCompetionsDetails,
	getResultsByCompetitionSchool,
	getStudentDetails,
	getStudents,
	removeAnnouncement,
	toggleCompetitionActive,
	uploadResultFile,
} from "../controllers/admin.controller";
import { changePassword } from "../controllers/auth.controller";
import formidableMiddleware from "express-formidable";
import { createSchool, getAllSchools } from "../controllers/school.controller";

const adminRoute = Router();

adminRoute.get("/", adminStats);

adminRoute.post("/create-announcement", tryCatchWapper(createAnnouncement));

adminRoute.lock("/announcement/:id", tryCatchWapper(removeAnnouncement));

adminRoute.post("/create-competition", tryCatchWapper(createCompetion));

adminRoute.post("/update-results", tryCatchWapper(uploadResultFile));

adminRoute.get("/competitions", tryCatchWapper(getAllCompetions));

adminRoute.get("/ongoing-competitions", tryCatchWapper(getActiveCompetion));

adminRoute.get("/competition/:id", tryCatchWapper(getCompetionsDetails));

adminRoute.get("/students/:competitionId", tryCatchWapper(getStudents));

adminRoute.get("/schools", tryCatchWapper(getAllSchools));

adminRoute.post("/school", tryCatchWapper(createSchool));

adminRoute.get("/student/:regNo", tryCatchWapper(getStudentDetails));

adminRoute.lock(
	"/competition/:id/:active",
	tryCatchWapper(toggleCompetitionActive)
);

adminRoute.get(
	"/results/:schoolId/:competitionId",
	tryCatchWapper(getResultsByCompetitionSchool)
);

adminRoute.get(
	"/results-template/:schoolId/:competitionId",
	tryCatchWapper(downloadResultTemp)
);

adminRoute.put("/password", tryCatchWapper(changePassword));

adminRoute.use(formidableMiddleware()).post(
	"/create-event",

	tryCatchWapper(createEvent)
);

export default adminRoute;
