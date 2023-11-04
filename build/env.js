"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string(),
    BASE_URL: zod_1.z.string(),
    DATABASE_URL: zod_1.z.string(),
    DEV_ENV: zod_1.z.string(),
    HASH_SECRET: zod_1.z.string(),
    PAYSTACK_SECRET_KEY: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
    // MAIL_USER: z.string(),
    // MAIL_PASSWORD: z.string(),
    // MAIL_HOST: z.string(),
    // MAIL_PORT: z.string(),
    CORS_ORIGIN: zod_1.z.string(),
});
const env = envSchema.parse(process.env);
exports.default = env;
//# sourceMappingURL=env.js.map