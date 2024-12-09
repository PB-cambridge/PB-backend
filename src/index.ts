import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "../env";

// swagger api doc
import { adminRoute, authRoute, userRoute } from "./routes";
import errorController, {
	tryCatchWapper,
} from "./controllers/error.controller";
import { getAllSchools } from "./controllers/school.controller";
import {
	getAnnouncements,
	getEvents,
	getEventsDetails,
} from "./controllers/admin.controller";
import { handleDropTable, handleSeedDB } from "../prisma/seed";
import { protectedRoute } from "./controllers/middleware.controller";
import formidableMiddleware from "express-formidable";
// import { authenticate } from "./controllers/middleWare";
// import { rateLimit } from "express-rate-limit";

const app: Application = express();
const PORT = +env.PORT || 3000;

// Middleware setup
// app.use(timeout("30s"));

app.use(
	cors({
		origin: env.CORS_ORIGIN.split(","),
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
	res.status(300).json({ msg: "welcome to the PB-Cambridge api" });
});

// API Doc endpoint
// app.use("/api/docs", swaggerUI.serve);
// app.get("/api/docs", swaggerUI.setup(swaggerConfig));

// auth route
app.use("/api/auth", authRoute);

// user route
app.use("/api/user", userRoute);

// admin route
app.use("/api/admin", protectedRoute, adminRoute);

// authenticate secured routes

// app.get("/api/db/seed", protectedRoute, tryCatchWapper(handleSeedDB));
// app.get("/api/db/drop-table", protectedRoute, tryCatchWapper(handleDropTable));
app.get("/api/schools", tryCatchWapper(getAllSchools));
app.get("/api/events", tryCatchWapper(getEvents));
app.get("/api/event/:id", tryCatchWapper(getEventsDetails));
app.get("/api/announcements", tryCatchWapper(getAnnouncements));

// error handler
app.use(errorController);

// Read the Base64 encoded file from the backend

app.listen(PORT, async () => {
	console.log(`Serving at ${env.BASE_URL}`);
});
