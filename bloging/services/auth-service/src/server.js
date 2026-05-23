import dotenv from "dotenv";
import { createApp } from "./app.js";
import { initDb } from "./db.js";

dotenv.config();

const port = process.env.AUTH_SERVICE_PORT || 3001;
const app = createApp();

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Auth service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start auth service", error);
    process.exit(1);
  });
