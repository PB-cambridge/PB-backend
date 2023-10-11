"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_controller_1 = require("../controllers/error.controller");
const userRoute = (0, express_1.Router)();
userRoute.get("/", (req, res) => {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "this is the users route",
        data: {},
    });
});
exports.default = userRoute;
//# sourceMappingURL=user.route.js.map