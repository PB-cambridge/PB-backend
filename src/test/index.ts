import bcrypt from "bcrypt";
// test1();
// test2();
(async () => {
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hashSync("password", salt);
	console.log(hashedPassword);
})();
