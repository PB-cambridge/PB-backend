"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_controller_1 = require("../controllers/error.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const authRoute = (0, express_1.Router)();
authRoute.post("/login", (0, error_controller_1.tryCatchWapper)(auth_controller_1.userLogin));
authRoute.post("/signup", (0, error_controller_1.tryCatchWapper)(auth_controller_1.registerUser));
authRoute.post("/send-opt", (0, error_controller_1.tryCatchWapper)(auth_controller_1.sendOTP));
exports.default = authRoute;
//# sourceMappingURL=auth.route.js.map