"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.sequelize = void 0;
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const sequelize_typescript_1 = require("sequelize-typescript");
const env_1 = __importDefault(require("../../env"));
const student_model_1 = __importStar(require("./student.model"));
const admin_model_1 = __importDefault(require("./admin.model"));
const event_model_1 = __importDefault(require("./event.model"));
const announcement_model_1 = __importDefault(require("./announcement.model"));
const result_model_1 = __importDefault(require("./result.model"));
const school_model_1 = __importDefault(require("./school.model"));
const admin_controller_1 = require("../controllers/admin.controller");
const user_route_1 = require("../routes/user.route");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: "PBC_db",
    dialect: "sqlite",
    // username: "root",
    // password: "",
    storage: env_1.default.DATABASE_URL,
    models: [__dirname + "./"],
});
exports.sequelize.addModels([
    student_model_1.default,
    admin_model_1.default,
    event_model_1.default,
    announcement_model_1.default,
    result_model_1.default,
    school_model_1.default,
]);
student_model_1.default.beforeCreate(({ registrationNumber }) => {
    registrationNumber = (0, student_model_1.generateRegistrationNumber)();
});
student_model_1.default.afterCreate(({ registrationNumber, schoolId }) => {
    result_model_1.default.create({
        studentRegNo: registrationNumber,
        schoolId,
        year: "2023",
    });
});
exports.sequelize
    .sync({
    logging: false,
    force: true,
    // alter: true,
})
    .then(() => {
    const { email, password } = {
        email: "teatadmin@gmail.com",
        password: "$2b$10$NN5LxOgYnjnNEu3u6adxfOafHYrxa50VpxWqtNrOz4h9HLwxM.URS",
    };
    admin_model_1.default.create({ email, password }).then((_) => console.log("created"));
});
() => __awaiter(void 0, void 0, void 0, function* () {
    const excelData = Buffer.from(user_route_1.resultFile, "base64");
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
    const indexTotal = (0, admin_controller_1.findIndexContainingString)(jsonData, "MARKS OBTAINABLE") || 0;
    for (let i = 2; i < indexTotal; i++) {
        resultData.push({
            studentName: jsonData[i][1],
            reading: jsonData[i][2],
            writing: jsonData[i][3],
            mathematics: jsonData[i][4],
            total: jsonData[i][5],
            position: jsonData[i][6],
            schoolName: jsonData[0][0],
            // schoolId: school.id,
            year: "2023",
        });
    }
    // result = await UserResult.bulkCreate(resultData);
    console.log(jsonData);
});
//# sourceMappingURL=sequelize.config.js.map