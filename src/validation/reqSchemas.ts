import { z } from "zod";

// custome validation function
export const getStringValidation = (key: string) =>
	z
		.string({
			required_error: `'${key}' is required`,
			invalid_type_error: `'${key}' must be a string`,
		})
		.min(3, { message: `'${key}' must be 3 or more characters` });

export const getOptionalStringValidation = (key: string) =>
	z
		.string({
			invalid_type_error: `'${key}' must be a string`,
		})
		.optional();

export const getNumberValidation = (key: string) =>
	z.number({
		required_error: `'${key}' is required`,
		invalid_type_error: `'${key}' must be a number`,
	});

export const phoneNumberSchema = z
	.string()
	.regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" })
	.min(7, { message: "Invalid phone number" })
	.max(14, { message: "Invalid phone number" })
	.transform((v) => v.replace(/\s/g, ""));

export const emailSchema = z
	.string({ required_error: "Email is required" })
	.email({ message: "Provide a valid email" });

// route Request validators
export const loginReqSchema = z.object({
	email: emailSchema,
	password: getStringValidation("password"),
});

/* 
  firstName           String
  lastName            String
  email               String?
  address             String
  phoneNumber         String?
  schoolId            String
  level               String
  scienceOrArt        String

  passport            String
  whatsappNumber      String?
  regNo               String          @unique
  acknowledgementSent Boolean         @default(false)
  result              StudentResult[]
  school              School          @relation(fields: [schoolId], references: [id])
*/

export const registerStudentReqSchema = z.object({
	firstName: getStringValidation("firstName"),
	lastName: getStringValidation("lastName"),
	email: emailSchema,
	address: getStringValidation("address"),
	hasInternationalPassport: z.boolean({
		required_error: `'hasInternationalPassport' is required`,
		invalid_type_error: `'hasInternationalPassport' must be a boolen`,
	}),
	phoneNumber: getStringValidation("phoneNumber"),
	schoolId: getStringValidation("schoolId"),
	// registeredCompetitionId: getStringValidation("registeredCompetitionId"),
	level: z.enum(["Junior", "Senior", "Graduated"], {
		invalid_type_error: "Please enter etiher 'Junior', 'Senior' or 'Graduated'",
	}),
	scienceOrArt: z.enum(["Science", "Art"], {
		invalid_type_error: "Science or Art expected",
	}),
	passport: getStringValidation("passport"),

	whatsappNumber: getOptionalStringValidation("whatsappNumber"),
});
