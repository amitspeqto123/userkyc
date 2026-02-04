import { createOrUpdateProfile } from "../services/profile.service.js";
import catchAsync from "../utils/catchAsync.js";

export const createProfileControllerr = catchAsync(async (req, res) => {
  const { fullName, address, images } = req.body;
  const userId = req.user.id; // JWT se milega
  const profile = await createOrUpdateProfile({
    userId,
    fullName,
    address,
    images,
  });
  res.status(200).json({
    success: true,
    message: "Profile created/updated successfully",
    profile,
  });
});
