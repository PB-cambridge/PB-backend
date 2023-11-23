"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = exports.hasExpired = exports.isValidToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../prisma"));
const error_controller_1 = require("./error.controller");
const AppError_1 = __importDefault(require("./AppError"));
const zod_1 = require("zod");
const env_1 = __importDefault(require("../../env"));
const isValidToken = (obj) => obj !== null && typeof obj == "object" && "id" in obj;
exports.isValidToken = isValidToken;
const hasExpired = (exp) => exp * 1000 < new Date().getTime();
exports.hasExpired = hasExpired;
const protectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = zod_1.z.object({ authed: zod_1.z.string() }).safeParse(req.cookies);
        if (!isValid.success)
            throw new AppError_1.default("Not logged in", error_controller_1.resCode.UNAUTHORIZED);
        // const providedToken = isValid.data.authed.split(" ")?.[1]?.trim();
        const providedToken = isValid.data.authed;
        if (!providedToken)
            throw new AppError_1.default("Invalid API key", error_controller_1.resCode.UNAUTHORIZED);
        const veriedToken = jsonwebtoken_1.default.verify(providedToken, env_1.default.HASH_SECRET);
        if (!(0, exports.isValidToken)(veriedToken))
            throw new AppError_1.default("Invalid API key", error_controller_1.resCode.UNAUTHORIZED);
        const { id, exp } = veriedToken;
        if (exp && (0, exports.hasExpired)(exp))
            throw new AppError_1.default("API key has expired", error_controller_1.resCode.UNAUTHORIZED);
        const admin = yield prisma_1.default.admin.findFirst({ where: { id } });
        if (!admin)
            throw new AppError_1.default("Invalid auth cookie", error_controller_1.resCode.UNAUTHORIZED);
        console.log(admin.email);
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.protectedRoute = protectedRoute;
//# sourceMappingURL=middleware.controller.js.map