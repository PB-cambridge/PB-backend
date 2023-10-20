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
exports.downloadResultTemp = exports.uploadResultFile = exports.createCompetion = void 0;
const error_controller_1 = require("./error.controller");
const zod_1 = require("zod");
const reqSchemas_1 = require("../validation/reqSchemas");
const AppError_1 = __importDefault(require("./AppError"));
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const helpers_controller_1 = require("./helpers.controller");
const index_1 = __importDefault(require("./../../prisma/index"));
// Example usage
const createCompetion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Create competition here",
    });
});
exports.createCompetion = createCompetion;
const uploadResultFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({
        schoolId: (0, reqSchemas_1.getStringValidation)("schoolId"),
        competitionId: (0, reqSchemas_1.getStringValidation)("competitionId"),
        resultFileString: (0, reqSchemas_1.getStringValidation)("resultFileString").refine((value) => (0, helpers_controller_1.isValidBase64)(value), {
            message: "Invalid Base64 string",
        }),
    })
        .safeParse(req.body);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { schoolId, competitionId, resultFileString } = safe.data;
    const results = yield index_1.default.studentResult.findMany({
        where: {
            schoolId,
            competitionId,
        },
    });
    if (!results || (yield results).length < 1)
        throw new AppError_1.default("No results", error_controller_1.resCode.NOT_FOUND);
    // result upload logic here
    let updatedItems;
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
        for (let i = 2; i < jsonData.length - 1; i++) {
            resultData.push({
                studentRegNo: jsonData[i][2],
                reading: jsonData[i][3],
                writing: jsonData[i][4],
                mathematics: jsonData[i][5],
                total: jsonData[i][6],
                position: jsonData[i][7],
                // schoolName: jsonData[0][0],
                // schoolId: school.id,
            });
        }
        // const updates = await prisma.studentResult.updateMany({
        // 	where: { studentRegNo: { in: results.map((item) => item.studentRegNo) } },
        // 	data: {},
        // });
        updatedItems = yield index_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const updatePromises = resultData.map((item) => {
                return prisma.studentResult.update({
                    where: { studentRegNo: item.studentRegNo },
                    data: item,
                });
            });
            return Promise.all(updatePromises);
        }));
        // .bulkCreate(resultData);
    }
    catch (error) {
        throw new AppError_1.default("Something wnet wrong with resullt upload", error_controller_1.resCode.INTERNAL_SERVER_ERROR, error);
    }
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Result uploaded successful",
        data: updatedItems,
    });
});
exports.uploadResultFile = uploadResultFile;
const downloadResultTemp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({
        schoolId: (0, reqSchemas_1.getStringValidation)("schoolId"),
        competitionId: (0, reqSchemas_1.getStringValidation)("competitionId"),
    })
        .safeParse(req.params);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { schoolId, competitionId } = safe.data;
    const results = yield index_1.default.studentResult.findMany({
        where: { schoolId, student: { competitionId: competitionId } },
        include: {
            school: true,
            student: { select: { firstName: true, lastName: true } },
        },
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