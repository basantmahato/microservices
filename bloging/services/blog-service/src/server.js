import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";

dotenv.config();

const port = process.env.BLOG_SERVICE_PORT || 3002;
const mongoUri =
  process.env.MONGO_URI ||
  `mongodb://localhost:${process.env.MONGO_PORT || 27017}/${process.env.MONGO_DATABASE || "blog_db"}`;
const app = createApp();

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Blog service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start blog service", error);
    process.exit(1);
  });
