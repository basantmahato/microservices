import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    authorId: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
