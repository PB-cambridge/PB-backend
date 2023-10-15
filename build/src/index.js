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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("../env"));
// swagger api doc
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const error_controller_1 = __importStar(require("./controllers/error.controller"));
const swagger_config_1 = __importDefault(require("./api-doc/swagger-config"));
require("./models/sequelize.config");
const seed_1 = __importDefault(require("./models/seed"));
const school_controller_1 = require("./controllers/school.controller");
// import timeout from "connect-timeout"
// import { authenticate } from "./controllers/middleWare";
// import { rateLimit } from "express-rate-limit";
const app = (0, express_1.default)();
const PORT = +env_1.default.PORT || 3000;
// Middleware setup
// app.use(timeout("30s"));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "2mb" }));
app.get("/", (req, res) => {
    res.status(300).json({ msg: "welcome to the PB-Cambridge api" });
});
// API Doc endpoint
app.use("/api/docs", swagger_ui_express_1.default.serve);
app.get("/api/docs", swagger_ui_express_1.default.setup(swagger_config_1.default));
// auth route
app.use("/api/auth", routes_1.authRoute);
// user route
app.use("/api/user", routes_1.userRoute);
// admin route
app.use("/api/admin", routes_1.adminRoute);
// authenticate secured routes
// app.use(authenticate);
app.get("/api/seed", (0, error_controller_1.tryCatchWapper)(seed_1.default));
app.get("/api/schools", (0, error_controller_1.tryCatchWapper)(school_controller_1.getSchools));
// error handler
app.use(error_controller_1.default);
// Read the Base64 encoded file from the backend
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Serving at ${env_1.default.BASE_URL}`);
}));
//# sourceMappingURL=index.js.map