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
	force: true,
	// alter: true,
});
