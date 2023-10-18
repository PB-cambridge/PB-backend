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
        eventId: (0, reqSchemas_1.getStringValidation)("eventId"),
    })
        .safeParse(req.params);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { schoolId, eventId } = safe.data;
    const results = yield result_model_1.default.findAll({
        where: { eventId, schoolId },
        include: [student_model_1.default, school_model_1.default],
    });
    if (!results || results.length < 1)
        throw new AppError_1.default("No results", error_controller_1.resCode.NOT_FOUND);
    const schoolName = "MOUNTAIN CREST INTERNATIONAL SECONDARY SCHOOL";
    const arrTitle = [
        `${results[0].school.name.toLocaleUpperCase()} SAT TEST RESULT`,
    ];
    const arrHeader = [
        "S/N",
        "NAME",
        "REG NUMBER",
        "READING",
        "WRITING",
        "MATH",
        "TOTAL",
        "POSITION",
    ];
    const rows = results.map((item, i) => [
        i + 1,
        item.student.firstName.toLocaleUpperCase() +
            " " +
            item.student.lastName.toLocaleUpperCase(),
        item.studentRegNo,
        item.reading,
        item.writing,
        item.mathematics,
        item.total,
        item.position,
    ]);
    const resultArrData = [
        arrTitle,
        arrHeader,
        ...rows,
        [null, "MARKS OBTAINABLE", , null, null, null, null],
    ];
    const sheetName = "sheet1";
    const fileName = results[0].school.name.replace(" ", "_") + "_results";
    const workbook = xlsx_1.default.utils.book_new();
    const worksheet = xlsx_1.default.utils.aoa_to_sheet(resultArrData);
    xlsx_1.default.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelBuffer = xlsx_1.default.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
    });
    // Send the Excel file
    res.setHeader("Content-Disposition", `attachment; filename=${fileName.toLocaleUpperCase()}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.status(error_controller_1.resCode.ACCEPTED).send(excelBuffer);
});
exports.downloadResultTemp = downloadResultTemp;
//# sourceMappingURL=admin.controller.js.map