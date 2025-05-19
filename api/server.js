import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import scamRoutes from "./routes/scamRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corsOptions =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? { origin: "https://scamzap.upayan.dev" }
    : {};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "API is online" });
});
app.use("/users", userRoutes);
app.use("/scams", scamRoutes);
app.use("/lessons", lessonRoutes);
app.use("/users", followRoutes);
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

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
