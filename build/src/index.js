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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("../env"));
// swagger api doc
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const error_controller_1 = __importDefault(require("./controllers/error.controller"));
const swagger_config_1 = __importDefault(require("./api-doc/swagger-config"));
require("./models/sequelize.config");
// import { authenticate } from "./controllers/middleWare";
// import { rateLimit } from "express-rate-limit";
const app = (0, express_1.default)();
const PORT = +env_1.default.PORT || 3000;
// Middleware setup
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "16kb" }));
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
// error handler
app.use(error_controller_1.default);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Serving at ${env_1.default.BASE_URL}`);
}));
//# sourceMappingURL=index.js.map