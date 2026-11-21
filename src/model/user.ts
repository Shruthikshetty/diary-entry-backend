import { model, Schema } from "mongoose";

export type IUser = {
  name: string;
  password: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// create schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// create model
const User = model<IUser>("User", userSchema);

//
export default User;
