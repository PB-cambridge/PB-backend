"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_controller_1 = require("../controllers/error.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const authRoute = (0, express_1.Router)();
authRoute.post("/admin-login", (0, error_controller_1.tryCatchWapper)(auth_controller_1.adminLogin));
authRoute.post("/register/:competitionId", auth_controller_1.verifyPaystackPayment, (0, error_controller_1.tryCatchWapper)(auth_controller_1.registerUser));
authRoute.post("/send-opt", (0, error_controller_1.tryCatchWapper)(auth_controller_1.sendOTP));
authRoute.get("/check-auth", (0, error_controller_1.tryCatchWapper)(auth_controller_1.checkAuth));
authRoute.get("/logout", (0, error_controller_1.tryCatchWapper)(auth_controller_1.AdminLogout));
exports.default = authRoute;
//# sourceMappingURL=auth.route.js.map