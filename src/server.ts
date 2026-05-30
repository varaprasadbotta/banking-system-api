import dotenv from "dotenv";

import app from "./app";

import { env } from "./config/env";

import { testDatabaseConnection } from "./db/test-db-connection";

dotenv.config();

const startServer = async (): Promise<void> => {
  try {
    await testDatabaseConnection();

    app.listen(env.PORT, () => {
      console.log(`🚀 Banking System API running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application");

    process.exit(1);
  }
};

startServer();
