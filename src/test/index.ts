import bcrypt from "bcrypt";
import prisma from "../../prisma";
import Paystack from "paystack";
import env from "../../env";
const paystack = Paystack(env.PAYSTACK_SECRET_KEY);
// test1();
// test2();

// (async () => {
// 	const salt = bcrypt.genSaltSync(10);
// 	const hashedPassword = await bcrypt.hashSync("password", salt);
// 	console.log(hashedPassword);
// })();
/*
 */
(async () => {
	const competitionId = "clnyckrlt0000o058nj92jv4j";
	const schoolId = "d3904ec9-29a2-4e7f-9d21-c903bd03d157";
	// const school = await prisma.school.findFirst({
	// 	where: {
	// 		id,
	// 	},
	// 	include: { results: true },
	// });

	// const results = await prisma.studentResult.findMany({
	// 	where: {
	// 		schoolId,
	// 		competitionId,
	// 	},
	// });

	// const compet = await prisma.competition.findFirst({
	// 	where: { AND: [{ id: competitionId }, {}] },
	// 	select: {
	// 		students: { where: { schoolId }, select: { result: true } },
	// 	},
	// 	// include: { registeredStudents: true },
	// });

	// const schoolResults = compet.map((item) => item)
	// console.log(results);
	const reference = "098765434567";

	const response = await paystack.transaction.verify(reference);
	console.log(response);
})();
