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
exports.getResultsByCompetitionSchool = exports.getStudentDetails = exports.getStudentsWithFilter = exports.getStudents = exports.getActiveCompetion = exports.getCompetionsDetails = exports.getAllCompetions = exports.downloadResultTemp = exports.uploadResultFile = exports.createCompetion = void 0;
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
    /*
      name           String          @unique
  students       Student[]
  results        StudentResult[]
  schools        School[]
  seniorRegFee   Int
  juniorRegFee   Int
  graduateRegFee Int
  active         Boolean         @default(true)
  startDate      DateTime
  endDate
    */
    const safeInput = zod_1.z
        .object({
        name: (0, reqSchemas_1.getStringValidation)("name"),
        schoolsId: zod_1.z.array((0, reqSchemas_1.getStringValidation)("schoolId")),
        seniorRegFee: (0, reqSchemas_1.getNumberValidation)("seniorRegFee"),
        juniorRegFee: (0, reqSchemas_1.getNumberValidation)("juniorRegFee"),
        graduateRegFee: (0, reqSchemas_1.getNumberValidation)("graduateRegFee"),
        active: zod_1.z
            .boolean({
            invalid_type_error: "'active' must be true / false",
        })
            .optional(),
        startDate: reqSchemas_1.dateSchema,
        endDate: reqSchemas_1.dateSchema,
    })
        .safeParse(req.body);
    if (!safeInput.success)
        throw new AppError_1.default(safeInput.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safeInput.error);
    const _a = safeInput.data, { schoolsId } = _a, others = __rest(_a, ["schoolsId"]);
    console.log(others);
    const createdCompetition = yield index_1.default.competition.create({
        data: Object.assign(Object.assign({}, others), { schools: { connect: schoolsId.map((id, i) => ({ id })) } }),
    });
    if (!createdCompetition)
        throw new AppError_1.default("AN error occourd and competition could not create", error_controller_1.resCode.BAD_REQUEST);
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Create competition here",
        data: { createdCompetition },
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
const getAllCompetions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const competitions = yield index_1.default.competition.findMany({
        include: { schools: true },
    });
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Fetch successful",
        data: { competitions },
    });
});
exports.getAllCompetions = getAllCompetions;
const getCompetionsDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({
        id: (0, reqSchemas_1.getStringValidation)("id"),
    })
        .safeParse(req.params);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { id } = safe.data;
    const competitionDetails = yield index_1.default.competition.findUnique({
        where: { id },
        include: { schools: true, students: { include: { result: true } } },
    });
    if (!competitionDetails)
        throw new AppError_1.default("Not found", error_controller_1.resCode.NOT_FOUND);
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Fetch successful",
        data: { competitionDetails },
    });
});
exports.getCompetionsDetails = getCompetionsDetails;
const getActiveCompetion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ongoingCompetitions = yield index_1.default.competition.findMany({
        where: { active: true },
        include: { schools: true },
    });
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Fetch successful",
        data: { ongoingCompetitions },
    });
});
exports.getActiveCompetion = getActiveCompetion;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +(req.query.page || 1);
    const skip = (page - 1) * 20;
    const students = yield index_1.default.student.findMany({
        take: 20,
        skip,
    });
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Fetch successful",
        data: { students, no_of_currenct_students: students.length },
    });
});
exports.getStudents = getStudents;
const getStudentsWithFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getStudentsWithFilter = getStudentsWithFilter;
const getStudentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({
        regNo: (0, reqSchemas_1.getStringValidation)("regNo"),
    })
        .safeParse(req.params);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), error_controller_1.resCode.BAD_REQUEST, safe.error);
    const { regNo } = safe.data;
    const studentDetails = yield index_1.default.student.findUnique({
        where: { regNo },
        include: { result: true, school: true, competition: true },
    });
    if (!studentDetails)
        throw new AppError_1.default("Not found", error_controller_1.resCode.NOT_FOUND);
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Fetch successful",
        data: { studentDetails },
    });
});
exports.getStudentDetails = getStudentDetails;
const getResultsByCompetitionSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            student: { select: { firstName: true, lastName: true, regNo: true } },
        },
    });
    if (!results)
        throw new AppError_1.default("Not found", error_controller_1.resCode.NOT_FOUND);
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "Fetch successful",
        data: { results },
    });
});
exports.getResultsByCompetitionSchool = getResultsByCompetitionSchool;
//# sourceMappingURL=admin.controller.js.map