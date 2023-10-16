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
exports.downloadResultTemp = exports.uploadResultFile = exports.isValidBase64 = exports.findIndexContainingString = void 0;
const error_controller_1 = require("./error.controller");
const zod_1 = require("zod");
const reqSchemas_1 = require("../validation/reqSchemas");
const AppError_1 = __importDefault(require("./AppError"));
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const result_model_1 = __importDefault(require("../models/result.model"));
const school_model_1 = __importDefault(require("../models/school.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
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
exports.isValidBase64 = isValidBase64;
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
const downloadResultTemp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({
        schoolId: (0, reqSchemas_1.getStringValidation)("schoolId"),
        year: (0, reqSchemas_1.getStringValidation)("year"),
    })
        .safeParse(req.params);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { schoolId: id, year } = safe.data;
    const school = yield school_model_1.default.findOne({
        where: { id },
        include: [student_model_1.default, result_model_1.default],
    });
    if (!school)
        throw new AppError_1.default("School not found", error_controller_1.resCode.NOT_FOUND);
    const students = school.students;
    if (students.length < 1)
        throw new AppError_1.default("School has no student", error_controller_1.resCode.NOT_FOUND, students);
    return res.status(error_controller_1.resCode.ACCEPTED).send(students);
    const schoolName = "MOUNTAIN CREST INTERNATIONAL SECONDARY SCHOOL";
    const resultArrData = [
        [`${schoolName} SAT TEST RESULT`],
        [
            "S/N",
            "NAME",
            "REG NUMBER",
            "READING",
            "WRITING",
            "MATH",
            "TOTAL",
            "POSITION",
        ],
        [5, "AHAM-NWOGU CHUKWUANUGO", `regNo`, null, null, null, null, ""],
        [14, "EMEH KOSISOCHUKWU", `regNo`, null, null, null, null, ""],
        [3, "AHAM-NWOGU KANYITOCHUKWU", `regNo`, null, null, null, null, ""],
        [8, "CHIGBO CHIDOZIE ANADEBE", `regNo`, null, null, null, null, ""],
        [15, "EBUBE CHIJIOKE OKERE", `regNo`, null, null, null, null, ""],
        [18, "NWUGO STEPHANIE", `regNo`, null, null, null, null, ""],
        [6, "CHUKWUEMEKA JOHN-OKAFOR", `regNo`, null, null, null, null, ""],
        [10, "CHIEKEZI FAVOUR IHEOUA", `regNo`, null, null, null, null, ""],
        [1, "AZIKE CLINTON", `regNo`, null, null, null, null, ""],
        [13, "DON-DANIEL UCHENNA", `regNo`, null, null, null, null, ""],
        [4, "AGWASIEM-OBASI CHIDUBEM", `regNo`, null, null, null, null, ""],
        [22, "OTUSOROCHUKWU EMMANUEL", `regNo`, null, null, null, null, ""],
        [17, "NNABUE CHIMAOBI", `regNo`, null, null, null, null, ""],
        [24, "UCHENNA PRECIOUS", `regNo`, null, null, null, null, ""],
        [9, "CHUKWUKA DIVINE-FAVOUR", `regNo`, null, null, null, null, ""],
        [21, "OKPO KAMSI DERRICK ", `regNo`, null, null, null, null, ""],
        [23, "THEODORE DIVINE-PROSPER", `regNo`, null, null, null, null, ""],
        [19, "NWOKORO GABRIEL PRIASE", `regNo`, null, null, null, null, ""],
        [7, "CHIDI IKECHUKWU", `regNo`, null, null, null, null, ""],
        [12, "KINGCHI DEVOP", `regNo`, null, null, null, null, ""],
        [11, "CHRISTABEL ANYIAM", `regNo`, null, null, null, null, ""],
        [2, "AZIKE FAVOUR", `regNo`, null, null, null, null, ""],
        [16, "IWUANYANWU JESSICA", `regNo`, null, null, null, null, ""],
        [20, "ONYEAMA SOMTOCHUKWU", `regNo`, null, null, null, null, ""],
        [null, "MARKS OBTAINABLE", , null, null, null, null],
    ];
    const sheetName = "sheet1";
    const fileName = "schoolName_result_template";
    const workbook = xlsx_1.default.utils.book_new();
    const worksheet = xlsx_1.default.utils.aoa_to_sheet(resultArrData);
    xlsx_1.default.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelBuffer = xlsx_1.default.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
    });
    // Send the Excel file
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.status(error_controller_1.resCode.ACCEPTED).send(excelBuffer);
});
exports.downloadResultTemp = downloadResultTemp;
//# sourceMappingURL=admin.controller.js.map