const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// }));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BrainQuest API is running"
  });
});

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);

app.use("/questions", questionRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});