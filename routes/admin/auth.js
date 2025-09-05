const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");

const Admin = require("../../models/Admin");

const router = require("express").Router();

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many accounts created from this IP, please try again after 60 minutes",
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many login attempts from this IP, please try again after 60 minutes",
});

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send("Admin already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword, isAdmin });
    await newAdmin.save();

    res.status(201).send("Admin registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

// Admin authentication routes
router.post("/login", async (req, res) => {
  try {
    // Handle admin login
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).send("Invalid email credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).send("Invalid password credentials");
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin },
      process.env.APP_JWT_SECRET,
      { expiresIn: process.env.APP_JWT_EXPIRES_IN }
    );
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
