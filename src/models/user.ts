import mongoose  from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string
}

const UserSchema = new mongoose.Schema<IUser>({
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


export const User = mongoose.model<IUser>("User", UserSchema);
