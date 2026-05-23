import { Blog } from "../models/Blog.js";

export async function getBlogs() {
  return Blog.find().sort({ createdAt: -1 });
}

export async function createBlog({ title, content, authorId }) {
  return Blog.create({ title, content, authorId });
}
