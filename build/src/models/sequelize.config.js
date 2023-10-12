"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const env_1 = __importDefault(require("../../env"));
const user_model_1 = __importDefault(require("./user.model"));
const admin_model_1 = __importDefault(require("./admin.model"));
const event_model_1 = __importDefault(require("./event.model"));
const announcement_model_1 = __importDefault(require("./announcement.model"));
const result_model_1 = __importDefault(require("./result.model"));
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: "PBC_db",
    dialect: "sqlite",
    // username: "root",
    // password: "",
    storage: env_1.default.DATABASE_URL,
    models: [__dirname + "./"],
});
exports.sequelize.addModels([user_model_1.default, admin_model_1.default, event_model_1.default, announcement_model_1.default, result_model_1.default]);
exports.sequelize.sync({
// force: true,
});
//# sourceMappingURL=sequelize.config.js.map