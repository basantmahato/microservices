import { checkDatabase } from "../services/healthService.js";

export async function healthCheck(_req, res, next) {
  try {
    await checkDatabase();
    res.json({ service: "auth-service", status: "ok", database: "postgres" });
  } catch (error) {
    next(error);
  }
}
