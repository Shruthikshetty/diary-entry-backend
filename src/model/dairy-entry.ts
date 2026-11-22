import { Schema, model, Types } from "mongoose";

// types
export type IDiaryEntry = {
  userId: Types.ObjectId | string;
  title: string;
  content: string;
  date?: Date;
  mood?: "happy" | "neutral" | "sad" | "excited" | "stressed";
  createdAt?: Date;
  updatedAt?: Date;
};

// create schema
const diaryEntrySchema = new Schema<IDiaryEntry>({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxLength: [1000, "Title cannot exceed 1000 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  mood: {
    type: String,
    enum: ["happy", "neutral", "sad", "excited", "stressed"],
    default: "neutral",
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
const DiaryEntry = model<IDiaryEntry>("DiaryEntry", diaryEntrySchema);

// export model
export default DiaryEntry;
