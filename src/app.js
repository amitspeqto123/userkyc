import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));


import authRoute from "./routes/auth.route.js";
// Routes
app.use("/v1/auth", authRoute);

export default app;