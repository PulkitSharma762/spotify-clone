const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Spotify Clone API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Audio file is too large"
          : err.message,
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;