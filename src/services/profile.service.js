import { Profile } from "../models/profile.model.js";

export const createOrUpdateProfile = async ({ userId, fullName, address, images }) => {
  let profile = await Profile.findOne({ userId });

  if (!profile) {
    profile = await Profile.create({ userId, fullName, address, images });
  } else {
    profile.fullName = fullName || profile.fullName;
    profile.address = address || profile.address;
    profile.images = images?.length ? images : profile.images;
    await profile.save();
  }
  return profile;
};
