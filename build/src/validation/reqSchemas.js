"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStudentReqSchema = exports.loginReqSchema = exports.emailSchema = exports.phoneNumberSchema = exports.getNumberValidation = exports.getOptionalStringValidation = exports.getStringValidation = exports.getBooleanValidation = exports.dateSchema = void 0;
const zod_1 = require("zod");
exports.dateSchema = zod_1.z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
})
    .refine((value) => {
    const date = new Date(value);
    const currentDate = new Date();
    return date > currentDate;
}, {
    message: "Date must be in the future",
})
    .transform((v) => new Date(v));
const getBooleanValidation = (v) => zod_1.z
    .enum(["true", "false"], {
    required_error: `'${v}' is required`,
})
    .transform((v) => v == "true");
exports.getBooleanValidation = getBooleanValidation;
const getStringValidation = (key) => zod_1.z
    .string({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a string`,
})
    .min(3, { message: `'${key}' must be 3 or more characters` });
exports.getStringValidation = getStringValidation;
const getOptionalStringValidation = (key) => zod_1.z
    .string({
    invalid_type_error: `'${key}' must be a string`,
})
    .optional();
exports.getOptionalStringValidation = getOptionalStringValidation;
const getNumberValidation = (key) => zod_1.z.number({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a number`,
});
exports.getNumberValidation = getNumberValidation;
exports.phoneNumberSchema = zod_1.z
    .string()
    .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" })
    .min(7, { message: "Invalid phone number" })
    .max(14, { message: "Invalid phone number" })
    .transform((v) => v.replace(/\s/g, ""));
exports.emailSchema = zod_1.z
    .string({ required_error: "Email is required" })
    .email({ message: "Provide a valid email" });
exports.loginReqSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: (0, exports.getStringValidation)("password"),
});
exports.registerStudentReqSchema = zod_1.z.object({
    firstName: (0, exports.getStringValidation)("firstName"),
    lastName: (0, exports.getStringValidation)("lastName"),
    email: exports.emailSchema,
    address: (0, exports.getStringValidation)("address"),
    hasInternationalPassport: zod_1.z.boolean({
        required_error: `'hasInternationalPassport' is required`,
        invalid_type_error: `'hasInternationalPassport' must be a boolen`,
    }),
    phoneNumber: (0, exports.getStringValidation)("phoneNumber"),
    schoolId: (0, exports.getStringValidation)("schoolId"),
    level: zod_1.z.enum(["Junior", "Senior", "Graduated"], {
        invalid_type_error: "Please enter etiher 'Junior', 'Senior' or 'Graduated'",
    }),
    scienceOrArt: zod_1.z.enum(["Science", "Art"], {
        invalid_type_error: "Science or Art expected",
    }),
    passport: (0, exports.getStringValidation)("passport"),
    whatsappNumber: (0, exports.getOptionalStringValidation)("whatsappNumber"),
});
//# sourceMappingURL=reqSchemas.js.map