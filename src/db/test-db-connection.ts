import { pool } from "./mysql";

export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    console.log("✅ Database connected successfully");

    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    throw error;
  }
};
