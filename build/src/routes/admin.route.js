"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_controller_1 = require("../controllers/error.controller");
const adminRoute = (0, express_1.Router)();
adminRoute.get("/", (req, res) => {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "this is the admin route",
        data: {},
    });
});
exports.default = adminRoute;
//# sourceMappingURL=admin.route.js.map