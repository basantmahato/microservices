import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { validateRequiredFields } from "../middlewares/validateRequest.js";

export const authRouter = Router();

authRouter.post("/register", validateRequiredFields(["name", "email", "password"]), register);
authRouter.post("/login", validateRequiredFields(["email", "password"]), login);
