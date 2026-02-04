import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export const signupService = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
};
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid email or password");

  if (!user.emailVerified)
    throw new Error("Please verify your email before logging in");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};
