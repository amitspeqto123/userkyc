import { EmailVerification } from "../models/emailVerification.model.js";
import { User } from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";


export const verifyEmailController = catchAsync(async (req, res) => {
  const { token } = req.query;

  const record = await EmailVerification.findOne({ token, isUsed: false });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification link",
    });
  }

  const user = await User.findById(record.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  //return res.redirect("http://localhost:5173/verify?status=fail");
  user.emailVerified = true;
  await user.save();

  record.isUsed = true;
  await record.save();

  // Frontend redirect
  //return res.redirect("http://localhost:5173/verify?status=success");
  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});
