import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

app.use(passport.initialize());
//app.use(passport.session());

import "./config/passport.js";

import authRoute from "./routes/auth.route.js";
// Routes
app.use("/auth", authRoute);

export default app;