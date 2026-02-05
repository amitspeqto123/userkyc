import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  kycReferenceId: {
    type: String,
    default: null, // Sumsub reference
  },
  documents: [
    {
      type: String, // Could be URLs to uploaded documents
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
}, { timestamps: true });

export const KYC = mongoose.model("KYC", kycSchema);
