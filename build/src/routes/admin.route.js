"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_controller_1 = require("../controllers/error.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const adminRoute = (0, express_1.Router)();
adminRoute.get("/", (req, res) => {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "this is the admin route",
        data: {},
    });
});
adminRoute.post("/create-event", (0, error_controller_1.tryCatchWapper)(admin_controller_1.createEvent));
adminRoute.post("/create-announcement", (0, error_controller_1.tryCatchWapper)(admin_controller_1.createAnnouncement));
adminRoute.post("/create-competition", (0, error_controller_1.tryCatchWapper)(admin_controller_1.createCompetion));
adminRoute.post("/update-results", (0, error_controller_1.tryCatchWapper)(admin_controller_1.uploadResultFile));
adminRoute.get("/competitions", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getAllCompetions));
adminRoute.get("/ongoing-competitions", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getActiveCompetion));
adminRoute.get("/competition/:id", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getCompetionsDetails));
adminRoute.get("/students/:competitionId", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getStudents));
adminRoute.get("/student/:regNo", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getStudentDetails));
adminRoute.lock("/competition/:id/:active", (0, error_controller_1.tryCatchWapper)(admin_controller_1.toggleCompetitionActive));
adminRoute.get("/results/:schoolId/:competitionId", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getResultsByCompetitionSchool));
adminRoute.get("/results-template/:schoolId/:competitionId", (0, error_controller_1.tryCatchWapper)(admin_controller_1.downloadResultTemp));
adminRoute.put("/password", (0, error_controller_1.tryCatchWapper)(auth_controller_1.changePassword));
exports.default = adminRoute;
//# sourceMappingURL=admin.route.js.map