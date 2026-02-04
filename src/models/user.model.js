import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // local password only
      required: function () {
        return this.provider === "LOCAL";
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    // status: {
    //   type: String,
    //   enum: ["PENDING", "ACTIVE", "BLOCKED"],
    //   default: "PENDING",
    // },
    provider: {
      type: String,
      enum: ["LOCAL", "GOOGLE", "GITHUB"],
      default: "LOCAL",
    },
    providerId: {
      type: String, // Google/GitHub OAuth ID
      default: null,
    },
  },
  { timestamps: true },
);

// Virtual for profile reference
userSchema.virtual("profile", {
  ref: "Profile",
  localField: "_id",
  foreignField: "userId",
});

export const User = mongoose.model("User", userSchema);
