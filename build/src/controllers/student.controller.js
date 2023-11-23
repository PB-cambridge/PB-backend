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
exports.reprintAcknowledgementSlip = exports.viewResult = void 0;
const error_controller_1 = require("./error.controller");
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("./AppError"));
const reqSchemas_1 = require("../validation/reqSchemas");
const prisma_1 = __importDefault(require("../../prisma"));
const viewResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z
        .object({ regNo: (0, reqSchemas_1.getStringValidation)("regNo") })
        .safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safeParam.error);
    const { regNo } = safeParam.data;
    const student = yield prisma_1.default.student.findUnique({
        where: { regNo },
        include: { result: true, school: true, competition: true },
    });
    if (!student)
        throw new AppError_1.default("Incorrect regNo", error_controller_1.resCode.NOT_FOUND);
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: `Check your result here with this your reg no ${req.params.regNo}`,
        data: { student },
    });
});
exports.viewResult = viewResult;
const reprintAcknowledgementSlip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z
        .object({ reference: (0, reqSchemas_1.getStringValidation)("reference") })
        .safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safeParam.error);
    const { reference } = safeParam.data;
    const paymentDetails = yield prisma_1.default.payments.findFirst({
        where: { paystackRef: reference },
    });
    if (!paymentDetails)
        throw new AppError_1.default("Invalid reference", error_controller_1.resCode.NOT_FOUND);
    const paymentDetails_studentData = JSON.parse(paymentDetails.studentData);
    const acknowledgementDetails = Object.assign(Object.assign({}, paymentDetails_studentData), { paidAmount: paymentDetails.amount, reference: paymentDetails.paystackRef });
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: `Reprint your Ack SLip here`,
        data: acknowledgementDetails,
    });
});
exports.reprintAcknowledgementSlip = reprintAcknowledgementSlip;
//# sourceMappingURL=student.controller.js.map