import axios from "axios";
import crypto from "crypto";
import { KYC } from "../models/kyc.model.js";
import { Profile } from "../models/profile.model.js";

const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
const SUMSUB_BASE_URL = process.env.SUMSUB_BASE_URL || "https://api.sumsub.com";

// Generate signature for Sumsub API
const generateSignature = (method, url, body = "") => {
  const ts = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac("sha256", SUMSUB_SECRET_KEY)
    .update(ts + method.toUpperCase() + url + body)
    .digest("hex");
  return { ts, signature };
};

// Create Sumsub applicant
export const createApplicant = async (userData) => {
  const url = "/resources/applicants?levelName=basic-kyc-level";
  const { ts, signature } = generateSignature(
    "POST",
    url,
    JSON.stringify(userData),
  );

  try {
    const response = await axios.post(`${SUMSUB_BASE_URL}${url}`, userData, {
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": SUMSUB_APP_TOKEN,
        "X-App-Access-Ts": ts,
        "X-App-Access-Sig": signature,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating Sumsub applicant:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to create applicant");
  }
};

// Generate access token for SDK
export const generateAccessToken = async (
  applicantId,
  levelName = "basic-kyc-level",
) => {
  const url = `/resources/accessTokens?userId=${applicantId}&levelName=${levelName}`;
  const { ts, signature } = generateSignature("POST", url);

  try {
    const response = await axios.post(
      `${SUMSUB_BASE_URL}${url}`,
      {},
      {
        headers: {
          "X-App-Token": SUMSUB_APP_TOKEN,
          "X-App-Access-Ts": ts,
          "X-App-Access-Sig": signature,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error generating access token:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to generate access token");
  }
};

// Get applicant status
export const getApplicantStatus = async (applicantId) => {
  const url = `/resources/applicants/${applicantId}/status`;
  const { ts, signature } = generateSignature("GET", url);

  try {
    const response = await axios.get(`${SUMSUB_BASE_URL}${url}`, {
      headers: {
        "X-App-Token": SUMSUB_APP_TOKEN,
        "X-App-Access-Ts": ts,
        "X-App-Access-Sig": signature,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting applicant status:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to get applicant status");
  }
};

// Initialize KYC for user
export const initiateKYC = async (profileId, userData) => {
  // Create Sumsub applicant
  const applicantData = {
    externalUserId: profileId.toString(),
    email: userData.email,
    phone: userData.phone || "",
    info: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      country: userData.country || "US",
    },
  };

  const applicant = await createApplicant(applicantData);

  // Generate access token
  const tokenData = await generateAccessToken(applicant.id);

  // Save to KYC model
  const kyc = await KYC.create({
    profileId,
    kycReferenceId: applicant.id,
    status: "SUBMITTED",
  });

  // Update profile with KYC reference
  await Profile.findByIdAndUpdate(profileId, {
    kycReferenceId: applicant.id,
    status: "PENDING",
  });

  return {
    kycId: kyc._id,
    applicantId: applicant.id,
    accessToken: tokenData.token,
    sdkUrl: `https://api.sumsub.com/idensic/liveness/${tokenData.token}`,
  };
};

// Handle Sumsub webhook
export const handleWebhook = async (webhookData) => {
  const { applicantId, type, reviewResult } = webhookData;

  if (type === "applicantReviewed") {
    const status =
      reviewResult?.reviewAnswer === "GREEN"
        ? "APPROVED"
        : reviewResult?.reviewAnswer === "RED"
          ? "REJECTED"
          : "PENDING";

    // Update KYC model
    await KYC.findOneAndUpdate({ kycReferenceId: applicantId }, { status });

    // Update Profile model
    await Profile.findOneAndUpdate({ kycReferenceId: applicantId }, { status });
  }

  return { success: true };
};
