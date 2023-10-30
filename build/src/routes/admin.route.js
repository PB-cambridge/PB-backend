"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_controller_1 = require("../controllers/error.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const adminRoute = (0, express_1.Router)();
adminRoute.get("/", (req, res) => {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "this is the admin route",
        data: {},
    });
});
adminRoute.post("/create-competition", (0, error_controller_1.tryCatchWapper)(admin_controller_1.createCompetion));
adminRoute.post("/update-results", (0, error_controller_1.tryCatchWapper)(admin_controller_1.uploadResultFile));
adminRoute.get("/ongoing-competitions", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getActiveCompetion));
adminRoute.get("/students", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getStudents));
adminRoute.get("/results-template/:schoolId/:competitionId", (0, error_controller_1.tryCatchWapper)(admin_controller_1.downloadResultTemp));
exports.default = adminRoute;
//# sourceMappingURL=admin.route.js.map