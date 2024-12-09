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
exports.createSchool = exports.getAllSchools = void 0;
const error_controller_1 = require("./error.controller");
const prisma_1 = __importDefault(require("../../prisma"));
const zod_1 = require("zod");
const reqSchemas_1 = require("../validation/reqSchemas");
const AppError_1 = __importDefault(require("./AppError"));
const getAllSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma_1.default.school.findMany({
        select: { _count: { select: { students: true } }, id: true, name: true },
    });
    const schools = data.map((_a) => {
        var { _count: { students } } = _a, __ = __rest(_a, ["_count"]);
        return (Object.assign({ students }, __));
    });
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "schools ",
        data: { schools },
    });
});
exports.getAllSchools = getAllSchools;
const createSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeInput = zod_1.z
        .object({
        name: (0, reqSchemas_1.getStringValidation)("name"),
    })
        .safeParse(req.body);
    if (!safeInput.success)
        throw new AppError_1.default(safeInput.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safeInput.error);
    const { name } = safeInput.data;
    const data = yield prisma_1.default.school.create({ data: { name } });
    return res.status(error_controller_1.resCode.CREATED).json({
        ok: true,
        message: "School created",
        data,
    });
});
exports.createSchool = createSchool;
//# sourceMappingURL=school.controller.js.map