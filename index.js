import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import modelsControllers from "./routes/hyundaiRoutes.js";
import colorsControllers from "./routes/colorRoutes.js";
import specificationControllers from "./routes/specificationRoutes.js";
import imgSlideControllers from "./routes/imgSlideRoutes.js";
import dealer from "./routes/dealerRoutes.js";
import link from "./routes/linkRoutes.js";
import Trims from "./routes/trimRoutes.js";
import joinData from "./routes/joinRoutes.js";
import users from "./routes/userRoutes.js";
import auth from "./routes/AuthRoutes.js";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Buat direktori logs jika belum ada
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Setup morgan untuk logging request HTTP ke file access.log
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Setup winston untuk logging error ke file error.log
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
    }),
    new winston.transports.Console(),
  ],
});

// Middleware CORS
app.options('*', cors());
app.use(
  cors({
    origin: ["https://hyundai-ams.co.id", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Middleware untuk session


// Middleware untuk parsing JSON dan static files
app.use(express.json());
app.use(express.static("public"));

// Definisi rute
app.use(modelsControllers);
app.use(auth);
app.use(users);
app.use(joinData);
app.use(colorsControllers);
app.use(specificationControllers);
app.use(imgSlideControllers);
app.use(link);
app.use(dealer);
app.use(Trims);

// Middleware untuk menangani 404 (Not Found)
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Middleware untuk error handling
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Jalankan server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
