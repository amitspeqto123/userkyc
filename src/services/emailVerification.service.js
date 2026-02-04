import { EmailVerification } from "../models/emailVerification.model.js";
import { sendMailgunEmail } from "../utils/mailgun.js";
import crypto from "crypto";

export const sendVerificationEmail = async (user) => {
  // generate token
  const token = crypto.randomBytes(32).toString("hex");

  // save in table
  await EmailVerification.create({
    userId: user._id,
    token,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  const verificationLink = `http://localhost:8080/auth/email-verification/verify-email?token=${token}`;

  // send mail
  await sendMailgunEmail({
    to: user.email,
    subject: "Verify your email",
    html: `
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationLink}" target="_blank" style="
        display:inline-block;
        padding:12px 20px;
        background:#4F46E5;
        color:#fff;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
      ">Verify Email</a>
      <p>Or copy-paste this link:<br/>${verificationLink}</p>
    `,
  });
};