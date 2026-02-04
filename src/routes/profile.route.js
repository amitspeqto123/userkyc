import express from "express";
import { createProfileControllerr } from "../controllers/profile.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createProfileControllerr);

export default router;