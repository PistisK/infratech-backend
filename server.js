import express from "express";
import cors from "cors";
import pool from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import chatbotRoutes from "./routes/chatbot.js";
import dotenv from "dotenv";

dotenv.config();
// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext; // unique filename
    cb(null, filename);
  },
});

const upload = multer({ storage });

const BASE_URL = process.env.BASE_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://infratechmw.com",
      "https://www.infratechmw.com",
    ],
  }),
);
app.use(express.json());

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey",
    );
    req.admin = decoded; // attach admin info
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    res.json({
      message: "Database connected ✅",
      serverTime: rows[0].time,
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({
      message: "Database connection failed indeed ❌",
      error: err.message,
    });
  }
});

// POST /api/admin/login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM admins WHERE email = ?", [
    email,
  ]);
  const admin = rows[0];

  if (!admin)
    return res.status(401).json({ message: "Invalid email or password" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match)
    return res.status(401).json({ message: "Invalid email or password" });

  // Generate JWT
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET || "supersecretkey",
    { expiresIn: "8h" },
  );

  res.json({ token, name: admin.name, email: admin.email });
});

/* GET SLIDES */
app.get("/api/slides", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM slides ORDER BY created_at DESC",
  );

  const slides = rows.map((slide) => ({
    ...slide,
    image: `${BASE_URL}/images/${slide.image}`,
  }));

  res.json(slides);
});

/* ADD SLIDE (ADMIN) */
// POST /api/admin/slides
app.post(
  "/api/admin/slides",

  upload.single("image"),
  async (req, res) => {
    const { title, subtitle, ctaText, ctaLink } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image required" });

    const imageFilename = req.file.filename;

    await pool.query(
      `INSERT INTO slides (title, subtitle, image, cta_text, cta_link)
     VALUES (?, ?, ?, ?, ?)`,
      [title, subtitle, imageFilename, ctaText, ctaLink],
    );

    res.json({ message: "Slide added successfully" });
  },
);

/* UPDATE SLIDE */
app.put("/api/admin/slides/:id", verifyToken, async (req, res) => {
  const { title, subtitle, image, ctaText, ctaLink } = req.body;

  await pool.query(
    `UPDATE slides
     SET title=?, subtitle=?, image=?, cta_text=?, cta_link=?
     WHERE id=?`,
    [title, subtitle, image, ctaText, ctaLink, req.params.id],
  );

  res.json({ message: "Slide updated" });
});

/* DELETE SLIDE */
app.delete("/api/admin/slides/:id", async (req, res) => {
  await pool.query("DELETE FROM slides WHERE id=?", [req.params.id]);
  res.json({ message: "Slide deleted" });
});

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.use(cors({ origin: "*" }));

// app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/images", express.static(path.join(process.cwd(), "public/images")));

app.use(express.json());
app.use("/api/chatbot", chatbotRoutes);

app.listen(PORT, () => console.log(`Server running ith MYSQL on port ${PORT}`));
