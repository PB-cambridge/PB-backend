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
exports.uploadResultFile = exports.findIndexContainingString = void 0;
const error_controller_1 = require("./error.controller");
const zod_1 = require("zod");
const reqSchemas_1 = require("../validation/reqSchemas");
const AppError_1 = __importDefault(require("./AppError"));
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const result_model_1 = __importDefault(require("../models/result.model"));
const school_model_1 = __importDefault(require("../models/school.model"));
function findIndexContainingString(arr, searchString) {
    return arr.findIndex(function (item) {
        return item.includes(searchString);
    });
}
exports.findIndexContainingString = findIndexContainingString;
function isValidBase64(str) {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
}
// Example usage
const uploadResultFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({
        schoolId: (0, reqSchemas_1.getStringValidation)("schoolId"),
        year: (0, reqSchemas_1.getStringValidation)("year"),
        resultFileString: (0, reqSchemas_1.getStringValidation)("resultFileString").refine((value) => isValidBase64(value), {
            message: "Invalid Base64 string",
        }),
    })
        .safeParse(req.body);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { schoolId: id, year, resultFileString } = safe.data;
    // check if schoool exists
    const school = yield school_model_1.default.findOne({ where: { id } });
    if (!school)
        throw new AppError_1.default("School not found", error_controller_1.resCode.NOT_FOUND);
    // result upload logic here
    let result;
    try {
        const excelData = Buffer.from(resultFileString, "base64");
        // Write the Excel data to a temporary file
        const tempFilePath = "temp.xlsx";
        fs_1.default.writeFileSync(tempFilePath, excelData);
        // Parse the Excel file
        const workbook = xlsx_1.default.readFile(tempFilePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // Convert the worksheet to JSON
        const jsonData = xlsx_1.default.utils.sheet_to_json(worksheet, {
            header: 1,
        });
        // Delete the temporary file
        fs_1.default.unlinkSync(tempFilePath);
        jsonData[1] = jsonData[1].map((d) => d.replace(/[^a-zA-Z]/g, ""));
        const resultData = [];
        const indexTotal = findIndexContainingString(jsonData, "MARKS OBTAINABLE") || 0;
        for (let i = 2; i < indexTotal; i++) {
            resultData.push({
                studentName: jsonData[i][1],
                reading: jsonData[i][2],
                writing: jsonData[i][3],
                mathematics: jsonData[i][4],
                total: jsonData[i][5],
                position: jsonData[i][6],
                schoolName: jsonData[0][0],
                schoolId: school.id,
                year,
            });
        }
        result = yield result_model_1.default.bulkCreate(resultData);
    }
    catch (error) {
        throw new AppError_1.default("Something wnet wrong with resullt upload", error_controller_1.resCode.INTERNAL_SERVER_ERROR, error);
    }
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Result uploaded successful",
        data: result,
    });
});
exports.uploadResultFile = uploadResultFile;
//# sourceMappingURL=admin.controller.js.map