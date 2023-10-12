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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = exports.registerUser = exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_controller_1 = require("./error.controller");
const AppError_1 = __importDefault(require("./AppError"));
const reqSchemas_1 = require("../validation/reqSchemas");
const env_1 = __importDefault(require("../../env"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = reqSchemas_1.loginReqSchema.safeParse(req.body);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { email, password } = safe.data;
    // authenticate here
    const admin = yield admin_model_1.default.findOne({ where: { email } });
    // findFirst({
    // 	where: { email },
    // 	select: { id: true, username: true, email: true, password: true },
    // });
    if (!admin)
        throw new AppError_1.default("Incorrect email", error_controller_1.resCode.UNAUTHORIZED);
    const authorised = yield bcrypt_1.default.compareSync(password, admin.password);
    if (!authorised)
        throw new AppError_1.default("Incorrect password", error_controller_1.resCode.UNAUTHORIZED);
    const token = jsonwebtoken_1.default.sign({ id: admin.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, env_1.default.HASH_SECRET + "");
    const { password: pass } = admin, adminData = __rest(admin, ["password"]);
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "ready to handle login request",
        data: adminData,
    });
});
exports.adminLogin = adminLogin;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "ready to register users",
        data: {},
    });
});
exports.registerUser = registerUser;
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Otp send successfully.",
        data: {},
    });
});
exports.sendOTP = sendOTP;
//# sourceMappingURL=auth.controller.js.map