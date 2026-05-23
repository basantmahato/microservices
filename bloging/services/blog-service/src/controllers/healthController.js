import { getDatabaseStatus } from "../services/healthService.js";

export function healthCheck(_req, res) {
  res.json({
    service: "blog-service",
    status: "ok",
    database: getDatabaseStatus()
  });
}
