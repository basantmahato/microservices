import { createBlog, getBlogs } from "../services/blogService.js";

export async function listBlogs(_req, res, next) {
  try {
    const blogs = await getBlogs();
    res.json({ blogs });
  } catch (error) {
    next(error);
  }
}

export async function publishBlog(req, res, next) {
  try {
    const blog = await createBlog(req.body);
    res.status(201).json({ blog });
  } catch (error) {
    next(error);
  }
}
