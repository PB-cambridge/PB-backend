import express, { Application } from "express";
import cors from "cors";
import env from "../env";
import fs from "fs";
import xlsx from "xlsx";

// swagger api doc
import swaggerUI from "swagger-ui-express";
import { adminRoute, authRoute, userRoute } from "./routes";
import errorController, {
	tryCatchWapper,
} from "./controllers/error.controller";
import swaggerConfig from "./api-doc/swagger-config";
import "./models/sequelize.config";
import seedDB from "./models/seed";
import { getSchools } from "./controllers/school.controller";
import { resultFile } from "./routes/user.route";
import { findIndexContainingString } from "./controllers/admin.controller";
// import timeout from "connect-timeout"
// import { authenticate } from "./controllers/middleWare";
// import { rateLimit } from "express-rate-limit";

const app: Application = express();
const PORT = +env.PORT || 3000;

// Middleware setup
// app.use(timeout("30s"));

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
	res.status(300).json({ msg: "welcome to the PB-Cambridge api" });
});

// API Doc endpoint
app.use("/api/docs", swaggerUI.serve);
app.get("/api/docs", swaggerUI.setup(swaggerConfig));

// auth route
app.use("/api/auth", authRoute);

// user route
app.use("/api/user", userRoute);

// admin route
app.use("/api/admin", adminRoute);

// authenticate secured routes
// app.use(authenticate);

app.get("/api/seed", tryCatchWapper(seedDB));
app.get("/api/schools", tryCatchWapper(getSchools));

// error handler
app.use(errorController);

// Read the Base64 encoded file from the backend

app.listen(PORT, async () => {
	console.log(`Serving at ${env.BASE_URL}`);
});
