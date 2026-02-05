import { createOrUpdateProfile } from "../services/profile.service.js";
import { initiateKYC } from "../services/kyc.service.js";
import catchAsync from "../utils/catchAsync.js";

export const createProfileControllerr = catchAsync(async (req, res) => {
  const { fullName, address, images, initiateKyc = true } = req.body;
  const userId = req.user.id; // JWT se milega
  const profile = await createOrUpdateProfile({
    userId,
    fullName,
    address,
    images,
  });

  let kycData = null;
  if (initiateKyc && !profile.kycReferenceId) {
    // Initiate KYC automatically after profile creation
    const userData = {
      email: req.user.email,
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ').slice(1).join(' '),
      phone: req.body.phone,
      country: req.body.country,
    };

    try {
      kycData = await initiateKYC(profile._id, userData);
    } catch (error) {
      console.error('KYC initiation failed:', error.message);
      // Don't fail profile creation if KYC fails
    }
  }

  res.status(200).json({
    success: true,
    message: "Profile created/updated successfully",
    profile,
    kyc: kycData ? {
      initiated: true,
      sdkUrl: kycData.sdkUrl,
      accessToken: kycData.accessToken,
    } : null,
  });
});
