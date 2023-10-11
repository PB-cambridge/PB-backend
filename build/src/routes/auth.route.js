"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_controller_1 = require("../controllers/error.controller");
const authRoute = (0, express_1.Router)();
authRoute.post("/login", (req, res) => {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "ready to handle login request",
        data: {},
    });
});
authRoute.post("/signup", (req, res) => {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "ready to register users",
        data: {},
    });
});
exports.default = authRoute;
//# sourceMappingURL=auth.route.js.map