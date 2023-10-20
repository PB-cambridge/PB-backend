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
const prisma_1 = __importDefault(require("../../prisma"));
// test1();
// test2();
// (async () => {
// 	const salt = bcrypt.genSaltSync(10);
// 	const hashedPassword = await bcrypt.hashSync("password", salt);
// 	console.log(hashedPassword);
// })();
/*
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    const competitionId = "clnyckrlt0000o058nj92jv4j";
    const schoolId = "d3904ec9-29a2-4e7f-9d21-c903bd03d157";
    // const school = await prisma.school.findFirst({
    // 	where: {
    // 		id,
    // 	},
    // 	include: { results: true },
    // });
    const results = yield prisma_1.default.studentResult.findMany({
        where: {
            schoolId,
            competitionId,
        },
    });
    // const compet = await prisma.competition.findFirst({
    // 	where: { AND: [{ id: competitionId }, {}] },
    // 	select: {
    // 		students: { where: { schoolId }, select: { result: true } },
    // 	},
    // 	// include: { registeredStudents: true },
    // });
    // const schoolResults = compet.map((item) => item)
    console.log(results);
}))();
//# sourceMappingURL=index.js.map