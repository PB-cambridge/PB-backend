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
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const env_1 = __importDefault(require("../../env"));
const user_model_1 = __importDefault(require("./user.model"));
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: "PBC_db",
    dialect: "sqlite",
    // username: "root",
    // password: "",
    storage: env_1.default.DATABASE_URL,
    models: [__dirname + "./"],
});
exports.sequelize.addModels([user_model_1.default]);
exports.sequelize.sync({
// force: true,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.create({
        age: 324,
        name: "sdsms",
        size: false,
    });
}))();
//# sourceMappingURL=sequelize.config.js.map