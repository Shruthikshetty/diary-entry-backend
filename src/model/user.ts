import { model, Schema } from "mongoose";

export type IUser = {
  name?: string;
  password: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// create schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
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

// export model
export default User;
