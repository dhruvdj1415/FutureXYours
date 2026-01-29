const express = require("express");
const cors = require("cors");
const data = require("./data.json");

const app = express();

// UPDATE THIS: Add Netlify URL
const allowedOrigins = [
  'http://localhost:3000',
  'https://futurexyours.vercel.app', // Keep for future
  'https://futurexyours.netlify.app'  // ADD THIS - your current frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.json({ 
    message: "✅ Backend is working!",
    status: "online",
    version: "1.0.0",
    endpoints: {
      register: "POST /register",
      plans: "GET /plans?type=monthly&email=user@example.com"
    }
  });
});

let users = [];

// Register API
app.post("/register", (req, res) => {
  console.log("📝 Register request received:", req.body);
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: "User already registered" });
  }
  
  users.push({ name, email });
  res.json({ 
    message: "User registered successfully",
    userCount: users.length 
  });
});

// Plans API
app.get("/plans", (req, res) => {
  const type = req.query.type;
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const userExists = users.some(u => u.email === email);
  
  if (!userExists) {
    return res.status(403).json({ error: "Register first" });
  }

  if (type === "monthly") return res.json(data.monthlyPlans);
  if (type === "yearly") return res.json(data.yearlyPlans);
  
  return res.status(400).json({ error: "Invalid type" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    users: users.length 
  });
});

// FIX: Use environment variable for port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});