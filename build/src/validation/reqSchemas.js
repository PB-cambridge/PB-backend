"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
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
//# sourceMappingURL=reqSchemas.js.map