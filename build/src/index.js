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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = __importDefault(require("../env"));
const routes_1 = require("./routes");
const error_controller_1 = __importStar(require("./controllers/error.controller"));
const school_controller_1 = require("./controllers/school.controller");
const admin_controller_1 = require("./controllers/admin.controller");
const seed_1 = require("../prisma/seed");
const middleware_controller_1 = require("./controllers/middleware.controller");
const app = (0, express_1.default)();
const PORT = +env_1.default.PORT || 3000;
app.use((0, cors_1.default)({
    origin: env_1.default.CORS_ORIGIN.split(","),
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: "2mb" }));
app.get("/", (req, res) => {
    res.status(300).json({ msg: "welcome to the PB-Cambridge api" });
});
app.use("/api/auth", routes_1.authRoute);
app.use("/api/user", routes_1.userRoute);
app.use("/api/admin", middleware_controller_1.protectedRoute, routes_1.adminRoute);
app.get("/api/db/seed", middleware_controller_1.protectedRoute, (0, error_controller_1.tryCatchWapper)(seed_1.handleSeedDB));
app.get("/api/db/drop-table", middleware_controller_1.protectedRoute, (0, error_controller_1.tryCatchWapper)(seed_1.handleDropTable));
app.get("/api/schools", (0, error_controller_1.tryCatchWapper)(school_controller_1.getAllSchools));
app.get("/api/events", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getEvents));
app.get("/api/announcements", (0, error_controller_1.tryCatchWapper)(admin_controller_1.getAnnouncements));
app.use(error_controller_1.default);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Serving at ${env_1.default.BASE_URL}`);
}));
//# sourceMappingURL=index.js.map