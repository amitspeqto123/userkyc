import express from "express";
import { verifyEmailController } from "../controllers/emailVerification.controller.js";

const router = express.Router();

router.get("/verify-email", verifyEmailController);

export default router;