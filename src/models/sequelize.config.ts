import { Sequelize } from "sequelize-typescript";
import env from "../../env";
import User from "./user.model";

export const sequelize = new Sequelize({
	database: "PBC_db",
	dialect: "sqlite",
	// username: "root",
	// password: "",
	storage: env.DATABASE_URL,
	models: [__dirname + "./"],
});

sequelize.addModels([User]);

sequelize.sync({
	// force: true,
});
