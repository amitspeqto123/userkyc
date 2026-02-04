import { handleSocialLogin, loginService, signupService } from "../services/auth.service.js";
import { sendVerificationEmail } from "../services/emailVerification.service.js";

export const signupController = async (req, res, next) => {
  try {
    const user = await signupService(req.body);
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
    await sendVerificationEmail(user)
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { user, token } = await loginService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
export const socialCallback = async (req, res) => {
  const data = await handleSocialLogin(req.user);
  res.json({
    message: `${req.user.provider} Login Successfully..`,
    ...data,
  });
};
