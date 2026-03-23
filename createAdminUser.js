import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// --- Config from .env ---
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "infratech",
};

const createAdmin = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const email = "admin@infratechmw.com";
    const password = "Admin@123"; // plaintext password
    const name = "Super Admin";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into table
    const [result] = await connection.execute(
      "INSERT INTO admins (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, name],
    );

    console.log("Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password} (plaintext for login)`);
    console.log("ID:", result.insertId);

    await connection.end();
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.log("Admin user already exists!");
    } else {
      console.error(err);
    }
  }
};

createAdmin();
