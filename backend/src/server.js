import cors from "cors";
import express from "express";
import { counties, featuredTowns, highways } from "./data/kenyaDirectory.js";
import pool from "./db.js";
import { hashPassword, comparePassword, generateToken, authenticateToken } from "./auth.js";

const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());

const landingData = { counties, featuredTowns, highways };

app.get("/", (_request, response) => {
  response.json({
    name: "YEK backend API",
    status: "running",
    endpoints: ["/api/health", "/api/landing", "/api/counties", "/api/highways", "/api/auth/signup", "/api/auth/login", "/api/profile"]
  });
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/landing", (_request, response) => {
  response.json(landingData);
});

app.get("/api/counties", (_request, response) => {
  response.json(counties);
});

app.get("/api/highways", (_request, response) => {
  response.json(highways);
});

// Auth Endpoints
app.post("/api/auth/signup", async (request, response) => {
  try {
    const { fullName, email, phone, password, countyCode, countyName, town, subscription } = request.body;

    // Validation
    if (!fullName || !email || !phone || !password || !countyCode || !town) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 8) {
      return response.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const connection = await pool.getConnection();

    // Check if email already exists
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return response.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Get or create user role (assuming role_id 2 is for regular users)
    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE name = 'user' LIMIT 1"
    );

    let roleId = 2;
    if (roles.length > 0) {
      roleId = roles[0].id;
    }

    // Create user
    const [result] = await connection.execute(
      "INSERT INTO users (role_id, full_name, email, phone, password_hash, status) VALUES (?, ?, ?, ?, ?, 'active')",
      [roleId, fullName, email, phone, passwordHash]
    );

    const userId = result.insertId;

    // Create profile
    await connection.execute(
      "INSERT INTO profiles (user_id, alias, county_code, county_name, town, subscription_plan_id, visibility_status) VALUES (?, ?, ?, ?, ?, ?, 'active')",
      [userId, fullName, countyCode, countyName, town, subscription === "VVIP" ? 1 : subscription === "VIP" ? 2 : 3]
    );

    connection.release();

    const token = generateToken(userId, email);

    response.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: userId,
        fullName,
        email,
        phone,
        county: countyName,
        town,
        subscription
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    response.status(500).json({ error: "Failed to create account" });
  }
});

app.post("/api/auth/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "Email and password required" });
    }

    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT id, full_name, email, password_hash, status FROM users WHERE email = ?",
      [email]
    );

    connection.release();

    if (users.length === 0) {
      return response.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    if (user.status === "suspended" || user.status === "blocked") {
      return response.status(403).json({ error: "Account is suspended or blocked" });
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return response.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id, user.email);

    response.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({ error: "Login failed" });
  }
});

// Protected Routes
app.get("/api/profile", authenticateToken, async (request, response) => {
  try {
    const userId = request.user.id;
    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT id, full_name, email, phone, status, created_at, updated_at FROM users WHERE id = ?",
      [userId]
    );

    const [profiles] = await connection.execute(
      "SELECT * FROM profiles WHERE user_id = ?",
      [userId]
    );

    connection.release();

    if (users.length === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const profile = profiles[0] || null;

    response.json({
      user,
      profile
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    response.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.put("/api/profile", authenticateToken, async (request, response) => {
  try {
    const userId = request.user.id;
    const { fullName, phone, alias, county, town, subscription } = request.body;

    const connection = await pool.getConnection();

    // Update user info
    if (fullName || phone) {
      const updateFields = [];
      const values = [];

      if (fullName) {
        updateFields.push("full_name = ?");
        values.push(fullName);
      }
      if (phone) {
        updateFields.push("phone = ?");
        values.push(phone);
      }

      values.push(userId);
      await connection.execute(
        `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
        values
      );
    }

    // Update profile info
    if (alias || county || town || subscription) {
      const profileUpdateFields = [];
      const profileValues = [];

      if (alias) {
        profileUpdateFields.push("alias = ?");
        profileValues.push(alias);
      }
      if (county) {
        profileUpdateFields.push("county_name = ?");
        profileValues.push(county);
      }
      if (town) {
        profileUpdateFields.push("town = ?");
        profileValues.push(town);
      }
      if (subscription) {
        profileUpdateFields.push("subscription_plan_id = ?");
        profileValues.push(subscription === "VVIP" ? 1 : subscription === "VIP" ? 2 : 3);
      }

      profileValues.push(userId);
      await connection.execute(
        `UPDATE profiles SET ${profileUpdateFields.join(", ")} WHERE user_id = ?`,
        profileValues
      );
    }

    connection.release();

    response.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    response.status(500).json({ error: "Failed to update profile" });
  }
});

const server = app.listen(port, host, () => {
  console.log(`YEK backend listening on http://${host}:${port}`);
});

server.on("error", async (error) => {
  if (error.code !== "EADDRINUSE") {
    throw error;
  }

  try {
    const response = await fetch(`http://${host}:${port}/api/health`);
    if (response.ok) {
      console.log(`YEK backend is already running on http://${host}:${port}`);
      process.exit(0);
    }
  } catch {
    // Another service may be using the port.
  }

  console.error(`Port ${port} is already in use. Set PORT to another value or stop the process using it.`);
  process.exit(1);
});
