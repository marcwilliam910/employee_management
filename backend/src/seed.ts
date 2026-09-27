import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {getPool, sql} from "./config/db";

dotenv.config();

const USERNAME = "admin"; // replace with your choice
const PLAINTEXT_PW = "admin123"; // replace with your choice

const seed = async () => {
  const pool = await getPool();
  const hash = await bcrypt.hash(PLAINTEXT_PW, 10);

  await pool
    .request()
    .input("username", sql.NVarChar, USERNAME)
    .input("passwordHash", sql.NVarChar, hash)
    .query(
      "INSERT INTO Users (username, passwordHash) VALUES (@username, @passwordHash)",
    );

  console.log(`Seeded user: ${USERNAME}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
