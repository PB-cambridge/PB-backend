"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginReqSchema = exports.emailSchema = exports.phoneNumberSchema = void 0;
const zod_1 = require("zod");
// custome validation function
const getStringValidation = (key) => zod_1.z
    .string({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a string`,
})
    .min(3, { message: `'${key}' must be 3 or more characters` });
const getNumberValidation = (key) => zod_1.z.number({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a number`,
});
exports.phoneNumberSchema = zod_1.z
    .string()
    .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" })
    .min(7, { message: "Invalid phone number" })
    .max(14, { message: "Invalid phone number" })
    .transform((v) => v.replace(/\s/g, ""));
exports.emailSchema = zod_1.z
    .string({ required_error: "Email is required" })
    .email({ message: "Provide a valid email" });
// route Request validators
exports.loginReqSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: getStringValidation("password"),
});
//# sourceMappingURL=reqSchemas.js.map