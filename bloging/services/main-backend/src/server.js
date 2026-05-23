import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const port = process.env.MAIN_BACKEND_PORT || 3000;
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const blogServiceUrl = process.env.BLOG_SERVICE_URL || "http://localhost:3002";

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    service: "main-backend",
    status: "ok",
    authServiceUrl,
    blogServiceUrl
  });
});

app.use(
  "/auth",
  createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    pathRewrite: { "^/auth": "" }
  })
);

app.use(
  "/blogs",
  createProxyMiddleware({
    target: blogServiceUrl,
    changeOrigin: true
  })
);

app.listen(port, () => {
  console.log(`Main backend running on port ${port}`);
});
