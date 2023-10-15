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
exports.getSchools = void 0;
const school_model_1 = __importDefault(require("../models/school.model"));
const error_controller_1 = require("./error.controller");
const getSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schools = yield school_model_1.default.findAll();
    return res.status(error_controller_1.resCode.ACCEPTED).json({
        ok: true,
        message: "schools ",
        data: schools,
    });
});
exports.getSchools = getSchools;
//# sourceMappingURL=school.controller.js.map