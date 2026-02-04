// src/routes/auth.route.js
import express from "express";
import passport from "passport";
import {
  loginController,
  signupController,
  socialCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  socialCallback,
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

// GitHub callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),

  socialCallback,
);
export default router;
