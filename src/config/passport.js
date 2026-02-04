import passport from "passport";
import dotenv from "dotenv";
import { githubStrategy } from "./githubStrategy.js";
import { googleStrategy } from "./googleStrategy.js";
import { User } from "../models/user.model.js";
dotenv.config();


passport.use(githubStrategy);
passport.use(googleStrategy);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
