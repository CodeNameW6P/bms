import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import connectDB from "./config/connectDB";
import { PORT } from "./config/env";
import cookieParser from "cookie-parser";

const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Welcome to the Building Management System API");
});

app.use("/api", routes);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server initiated on port ${PORT}`);
	});
});
