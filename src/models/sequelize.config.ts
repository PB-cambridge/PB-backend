import { Sequelize } from "sequelize-typescript";
import env from "../../env";
import User from "./user.model";
import Admin from "./admin.model";
import Event from "./event.model";
import Announcement from "./announcement.model";
import UserResult from "./result.model";
import School from "./school.model";

export const sequelize = new Sequelize({
	database: "PBC_db",
	dialect: "sqlite",
	// username: "root",
	// password: "",
	storage: env.DATABASE_URL,
	models: [__dirname + "./"],
});

sequelize.addModels([User, Admin, Event, Announcement, UserResult, School]);

sequelize.sync({
	logging: false,
	// force: true,
	// alter: true,
});

async () => {
	const id = "64221a1b-5262-4c41-b384-fc6eafe75eac";

	const data = await School.findOne({ where: { id }, include: [User] });

	const res = await UserResult.findOne({
		where: { studentName: "CHRISTABEL ANYIAM" },
		attributes: { exclude: ["updatedAt", "createdAt", "id"] },
		include: [],
	});

	console.log(JSON.stringify(res, null, 2));
};
