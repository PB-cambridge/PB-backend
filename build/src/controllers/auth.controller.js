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
exports.sendOTP = exports.registerUser = exports.verifyPaystackPayment = exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_controller_1 = require("./error.controller");
const AppError_1 = __importDefault(require("./AppError"));
const reqSchemas_1 = require("../validation/reqSchemas");
const env_1 = __importDefault(require("../../env"));
const prisma_1 = __importDefault(require("../../prisma"));
const zod_1 = require("zod");
const helpers_controller_1 = require("./helpers.controller");
const paystack_1 = __importDefault(require("paystack"));
const mail_controller_1 = require("./mail.controller");
const paystack = (0, paystack_1.default)(env_1.default.PAYSTACK_SECRET_KEY);
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = reqSchemas_1.loginReqSchema.safeParse(req.body);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { email, password } = safe.data;
    // authenticate here
    const admin = yield prisma_1.default.admin.findFirst({ where: { email } });
    if (!admin)
        throw new AppError_1.default("Incorrect email", error_controller_1.resCode.UNAUTHORIZED);
    const authorised = bcrypt_1.default.compareSync(password, admin.password);
    if (!authorised)
        throw new AppError_1.default("Incorrect password", error_controller_1.resCode.UNAUTHORIZED);
    const token = jsonwebtoken_1.default.sign({ id: admin.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, env_1.default.HASH_SECRET + "");
    const { password: pass } = admin, adminData = __rest(admin, ["password"]);
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Login successfull",
        data: adminData,
        token,
    });
});
exports.adminLogin = adminLogin;
const verifyPaystackPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const safeQuery = zod_1.z
            .object({ reference: (0, reqSchemas_1.getStringValidation)("reference") })
            .safeParse(req.query);
        if (!safeQuery.success)
            throw new AppError_1.default(safeQuery.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safeQuery.error);
        const { reference } = safeQuery.data;
        const safeParam = zod_1.z
            .object({ competitionId: (0, reqSchemas_1.getStringValidation)("competitionId") })
            .safeParse(req.params);
        if (!safeParam.success)
            throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safeParam.error);
        const { competitionId } = safeParam.data;
        const safe = reqSchemas_1.registerStudentReqSchema.safeParse(req.body);
        if (!safe.success)
            throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
        const _a = safe.data, { passport, schoolId, firstName } = _a, others = __rest(_a, ["passport", "schoolId", "firstName"]);
        // verify payment for the competition using paystack
        const response = yield paystack.transaction.verify("" + reference);
        if (!response.status)
            throw new AppError_1.default(response.message, error_controller_1.resCode.NOT_ACCEPTED, response);
        res.locals.paymentDetails = response.data;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.verifyPaystackPayment = verifyPaystackPayment;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z
        .object({ competitionId: (0, reqSchemas_1.getStringValidation)("competitionId") })
        .safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safeParam.error);
    const { competitionId } = safeParam.data;
    const safe = reqSchemas_1.registerStudentReqSchema.safeParse(req.body);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const _b = safe.data, { passport: _passport, schoolId, firstName, email } = _b, others = __rest(_b, ["passport", "schoolId", "firstName", "email"]);
    const uploadImageRes = yield (0, helpers_controller_1.uploadImage)(_passport);
    if (uploadImageRes.error)
        throw new AppError_1.default("An error Occoured", error_controller_1.resCode.BAD_GATEWAY, uploadImageRes.error);
    const passport = uploadImageRes.url;
    const paymentDetails = res.locals.paymentDetails;
    const paidAmt = (paymentDetails.amount / 100);
    const competion = yield prisma_1.default.competition.findFirst({
        where: { id: competitionId },
        include: { schools: true },
    });
    if (!competion)
        throw new AppError_1.default("Competition with the provided id does not exist", error_controller_1.resCode.NOT_FOUND);
    const requiredFee = others.level == "Senior"
        ? competion.seniorRegFee
        : others.level == "Junior"
            ? competion.juniorRegFee
            : competion.graduateRegFee;
    if (paidAmt < requiredFee)
        throw new AppError_1.default(`The required amount for ${others.level} is #${requiredFee}`, error_controller_1.resCode.NOT_ACCEPTED);
    const selectedSchool = competion.schools.find((item, i) => item.id == schoolId);
    if (!selectedSchool)
        throw new AppError_1.default("This competion is not hosted for your school", error_controller_1.resCode.NOT_FOUND);
    //  passport to file
    const registeredStudent = yield prisma_1.default.student.create({
        data: Object.assign(Object.assign({ firstName,
            passport,
            email, competitionId: competitionId, schoolId, regNo: (0, helpers_controller_1.regNo)(firstName) }, others), { result: { create: { schoolId, competitionId } } }),
        include: {
            school: true,
            competition: {
                select: { id: true, endDate: true, startDate: true, name: true },
            },
        },
    });
    // Add to payment
    const addedPay = yield prisma_1.default.payments.create({
        data: {
            amount: paidAmt,
            competitionId,
            paystackRef: paymentDetails.reference,
            studentData: JSON.stringify(registeredStudent),
        },
    });
    // send acknowledgement email
    const acknowledgementMail = (0, helpers_controller_1.generateAcknowledgementSlip)(Object.assign(Object.assign({}, registeredStudent), { competionFee: requiredFee, paidAmount: paidAmt, reference: paymentDetails.reference }));
    try {
        (0, mail_controller_1.sendEmail)(email, acknowledgementMail, "PAYMENT ACKNOWLEDGEMENT");
    }
    catch (error) {
        console.log(error);
    }
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Registration Successful",
        data: Object.assign(Object.assign({}, registeredStudent), { competionFee: requiredFee, paidAmount: paidAmt, reference: paymentDetails.reference }),
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