import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    requeired: true,
  },
  email: {
    type: String,
    requeired: true,
    unique: true
  },
  passwordHash: {
    type: String,
    requeired: true,
  },
  avatarUrl: String,
}, {
    timestamps: true,
});


export const User = mongoose.model("User", UserSchema);
