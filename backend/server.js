const express = require("express");
const cors = require("cors");
const data = require("./data.json");

const app = express();

// Fix CORS - allow your React app's origin
app.use(cors({
  origin: 'http://localhost:3000', // React default port
  credentials: true
}));

app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

let users = [];

// Register API - ADD CONSOLE LOGS
app.post("/register", (req, res) => {
  console.log("📝 Register request received:", req.body);
  
  const { name, email } = req.body;
  
  // Validate input
  if (!name || !email) {
    console.log("❌ Missing name or email");
    return res.status(400).json({ error: "Name and email are required" });
  }
  
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    console.log("❌ User already exists:", email);
    return res.status(400).json({ error: "User already registered" });
  }
  
  users.push({ name, email });
  console.log("✅ User registered:", { name, email });
  console.log("📊 Total users:", users.length);
  
  res.json({ message: "User registered successfully" });
});

// Plans API - ADD CONSOLE LOGS
app.get("/plans", (req, res) => {
  console.log("📋 Plans request:", req.query);
  
  const type = req.query.type;   // monthly/yearly
  const email = req.query.email; // email from frontend

  if (!email) {
    console.log("❌ No email provided");
    return res.status(400).json({ error: "Email is required" });
  }

  // Check if user exists
  const userExists = users.some(u => u.email === email);
  console.log("👤 User exists?", userExists, "Email:", email);

  if (!userExists) {
    return res.status(403).json({ error: "Register first" });
  }

  // Send plans if user is registered
  if (type === "monthly") {
    console.log("📅 Sending monthly plans");
    return res.json(data.monthlyPlans);
  }
  if (type === "yearly") {
    console.log("📊 Sending yearly plans");
    return res.json(data.yearlyPlans);
  }

  return res.status(400).json({ error: "Invalid type" });
});

// Add error logging middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
});