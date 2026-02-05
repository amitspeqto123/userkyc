import { initiateKYC, getApplicantStatus, handleWebhook } from '../services/kyc.service.js';
import catchAsync from '../utils/catchAsync.js';
import { Profile } from '../models/profile.model.js';

// Initiate KYC process
export const initiateKYCController = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const profile = await Profile.findOne({ userId });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found. Please create a profile first.',
    });
  }

  // Check if KYC already initiated
  if (profile.kycReferenceId) {
    return res.status(400).json({
      success: false,
      message: 'KYC already initiated for this profile.',
    });
  }

  const userData = {
    email: req.user.email,
    firstName: profile.fullName.split(' ')[0],
    lastName: profile.fullName.split(' ').slice(1).join(' '),
    phone: req.body.phone,
    country: req.body.country,
  };

  const kycData = await initiateKYC(profile._id, userData);

  res.status(200).json({
    success: true,
    message: 'KYC initiated successfully',
    data: kycData,
  });
});

// Get KYC status
export const getKYCStatusController = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const profile = await Profile.findOne({ userId }).populate('kycReferenceId');

  if (!profile || !profile.kycReferenceId) {
    return res.status(404).json({
      success: false,
      message: 'KYC not initiated for this profile.',
    });
  }

  const statusData = await getApplicantStatus(profile.kycReferenceId);

  res.status(200).json({
    success: true,
    data: {
      status: profile.status,
      sumsubStatus: statusData,
    },
  });
});

// Webhook handler for Sumsub
export const webhookController = catchAsync(async (req, res) => {
  const webhookSecret = process.env.SUMSUB_WEBHOOK_SECRET;

  // Verify webhook signature (implement based on Sumsub docs)
  // For now, assuming it's valid

  await handleWebhook(req.body);

  res.status(200).json({ success: true });
});