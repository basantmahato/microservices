import { loginUser, registerUser } from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
