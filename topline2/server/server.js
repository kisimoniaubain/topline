import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

/* =========================================
   API ROUTES
========================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Topline server is running",
  });
});

app.use("/api/auth", authRoutes);

/* =========================================
   SERVE REACT / VITE FRONTEND
========================================= */

const distPath = path.join(__dirname, "..", "dist");

app.use(express.static(distPath));

/*
  React Router fallback.
  API routes are handled above.
  All other routes return the React app.
*/

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(distPath, "index.html"));
});

/* =========================================
   START SERVER
========================================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Connected to MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Topline server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();