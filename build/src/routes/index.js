"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = exports.userRoute = exports.authRoute = void 0;
var auth_route_1 = require("./auth.route");
Object.defineProperty(exports, "authRoute", { enumerable: true, get: function () { return __importDefault(auth_route_1).default; } });
var user_route_1 = require("./user.route");
Object.defineProperty(exports, "userRoute", { enumerable: true, get: function () { return __importDefault(user_route_1).default; } });
var admin_route_1 = require("./admin.route");
Object.defineProperty(exports, "adminRoute", { enumerable: true, get: function () { return __importDefault(admin_route_1).default; } });
//# sourceMappingURL=index.js.map