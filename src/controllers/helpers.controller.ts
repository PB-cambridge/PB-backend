export const regNo = (username: string) => {
	const year = new Date().getFullYear();
	const month = new Date().getMonth() + 1;
	const randomCode = Math.floor(Math.random() * 999999)
		.toString()
		.padStart(6, "0");

	return `${username
		.slice(0, 3)
		.toLocaleUpperCase()}${randomCode}${month}${year}`;
};
