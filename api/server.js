import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authenticateToken from "./middleware/authToken.js";
import userRoutes from "./routes/userRoutes.js";
import scamRoutes from "./routes/scamRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup depending on environment
const corsOptions =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? { origin: process.env.NEXTAUTH_URL }
    : { origin: "*" };



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "API is online" });
});
app.use("/users", authenticateToken, userRoutes);
app.use("/scams", authenticateToken, scamRoutes);
app.use("/lessons", authenticateToken, lessonRoutes);
app.use("/users", authenticateToken, followRoutes);
app.use("/admin", authenticateToken, adminRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("CORS options:", corsOptions);
    app.listen(PORT, () =>
      console.log(
        `Server running on port ${PORT}\nAPI: http://localhost:${PORT}`
      )
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
