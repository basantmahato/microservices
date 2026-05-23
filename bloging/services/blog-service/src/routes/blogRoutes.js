import { Router } from "express";
import { listBlogs, publishBlog } from "../controllers/blogController.js";
import { validateRequiredFields } from "../middlewares/validateRequest.js";

export const blogRouter = Router();

blogRouter.get("/", listBlogs);
blogRouter.post("/", validateRequiredFields(["title", "content"]), publishBlog);
